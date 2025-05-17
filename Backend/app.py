from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from functools import wraps

app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Error handling middleware
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Configuration
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'isAdmin': self.is_admin,
            'createdAt': self.created_at.isoformat()
        }

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    beds = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(200), nullable=False)
    available = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'price': self.price,
            'capacity': self.capacity,
            'beds': self.beds,
            'bathrooms': self.bathrooms,
            'description': self.description,
            'image': self.image,
            'available': self.available
        }

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'roomId': self.room_id,
            'userId': self.user_id,
            'checkIn': self.check_in.isoformat(),
            'checkOut': self.check_out.isoformat(),
            'guests': self.guests,
            'paymentMethod': self.payment_method,
            'totalPrice': self.total_price,
            'createdAt': self.created_at.isoformat()
        }

# Create database tables
with app.app_context():
    db.create_all()
    
    # Create admin user if not exists
    admin = User.query.filter_by(email='admin@example.com').first()
    if not admin:
        admin = User(
            name='Admin User',
            email='admin@example.com',
            password=generate_password_hash('admin123'),
            is_admin=True
        )
        db.session.add(admin)
        
        # Add some sample rooms
        rooms = [
            Room(
                name='Deluxe King Room',
                type='deluxe',
                price=199.99,
                capacity=2,
                beds=1,
                bathrooms=1,
                description='Spacious room with a king-size bed and city view.',
                image='/assets/deluxe_king_room.jpg',
                available=True
            ),
            Room(
                name='Executive Suite',
                type='suite',
                price=299.99,
                capacity=2,
                beds=1,
                bathrooms=1,
                description='Luxury suite with separate living area and premium amenities.',
                image='/assets/executive_suite.jpeg',
                available=True
            ),
            Room(
                name='Family Room',
                type='family',
                price=249.99,
                capacity=4,
                beds=2,
                bathrooms=1,
                description='Perfect for families with two queen beds and extra space.',
                image='/assets/family_room.jpeg',
                available=True
            ),
            Room(
                name='Standard Double Room',
                type='standard',
                price=149.99,
                capacity=2,
                beds=1,
                bathrooms=1,
                description='Comfortable room with a double bed and all essential amenities.',
                image='/assets/standard_room.jpeg',
                available=True
            ),
            # Additional rooms for testing
            Room(
                name='Premium Suite',
                type='suite',
                price=350.00,
                capacity=3,
                beds=2,
                bathrooms=2,
                description='Premium suite with two bedrooms and a living area.',
                image='/assets/executive_suite.jpeg',
                available=True
            ),
            Room(
                name='Economy Room',
                type='standard',
                price=99.99,
                capacity=1,
                beds=1,
                bathrooms=1,
                description='Affordable room for solo travelers.',
                image='/assets/standard_room.jpeg',
                available=True
            ),
            Room(
                name='Deluxe Twin Room',
                type='deluxe',
                price=189.99,
                capacity=2,
                beds=2,
                bathrooms=1,
                description='Deluxe room with two twin beds.',
                image='/assets/deluxe_king_room.jpg',
                available=True
            ),
            Room(
                name='Family Suite',
                type='family',
                price=279.99,
                capacity=5,
                beds=3,
                bathrooms=2,
                description='Large suite for families with three beds and two bathrooms.',
                image='/assets/family_room.jpeg',
                available=True
            )
        ]
        
        for room in rooms:
            db.session.add(room)
        
        db.session.commit()

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            app.logger.info(f'Auth header: {auth_header}')
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
                
            return f(current_user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError as e:
            app.logger.error(f'Invalid token error: {str(e)}')
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception as e:
            app.logger.error(f'Token verification error: {str(e)}')
            return jsonify({'message': 'Error verifying token!'}), 401
    
    return decorated

# Admin required decorator
def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin:
            return jsonify({'message': 'Admin privileges required!'}), 403
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/users/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
        
    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'id': new_user.id,
        'name': new_user.name,
        'email': new_user.email,
        'isAdmin': new_user.is_admin,
        'token': token
    }), 201

@app.route('/api/users/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
        
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'isAdmin': user.is_admin,
        'token': token
    }), 200

@app.route('/api/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user):
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([room.to_dict() for room in rooms]), 200

@app.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    room = Room.query.get_or_404(room_id)
    return jsonify(room.to_dict()), 200

@app.route('/api/rooms', methods=['POST'])
@token_required
@admin_required
def create_room(current_user):
    data = request.get_json()
    
    if not all(key in data for key in ['name', 'type', 'price', 'capacity', 'beds', 'bathrooms', 'description', 'image']):
        return jsonify({'message': 'Missing required fields'}), 400
        
    new_room = Room(
        name=data['name'],
        type=data['type'],
        price=data['price'],
        capacity=data['capacity'],
        beds=data['beds'],
        bathrooms=data['bathrooms'],
        description=data['description'],
        image=data['image'],
        available=data.get('available', True)
    )
    
    db.session.add(new_room)
    db.session.commit()
    
    return jsonify(new_room.to_dict()), 201

@app.route('/api/rooms/<int:room_id>', methods=['PUT'])
@token_required
@admin_required
def update_room(current_user, room_id):
    room = Room.query.get_or_404(room_id)
    data = request.get_json()
    
    if 'name' in data:
        room.name = data['name']
    if 'type' in data:
        room.type = data['type']
    if 'price' in data:
        room.price = data['price']
    if 'capacity' in data:
        room.capacity = data['capacity']
    if 'beds' in data:
        room.beds = data['beds']
    if 'bathrooms' in data:
        room.bathrooms = data['bathrooms']
    if 'description' in data:
        room.description = data['description']
    if 'image' in data:
        room.image = data['image']
    if 'available' in data:
        room.available = data['available']
    
    db.session.commit()
    
    return jsonify(room.to_dict()), 200

@app.route('/api/rooms/<int:room_id>', methods=['PATCH'])
@token_required
@admin_required
def patch_room(current_user, room_id):
    room = Room.query.get_or_404(room_id)
    data = request.get_json()
    
    if 'available' in data:
        room.available = data['available']
        db.session.commit()
    
    return jsonify(room.to_dict()), 200

@app.route('/api/rooms/<int:room_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_room(current_user, room_id):
    room = Room.query.get_or_404(room_id)
    
    # Check if room has reservations
    reservations = Reservation.query.filter_by(room_id=room_id).first()
    if reservations:
        return jsonify({'message': 'Cannot delete room with existing reservations'}), 400
    
    db.session.delete(room)
    db.session.commit()
    
    return jsonify({'message': 'Room deleted successfully'}), 200

@app.route('/api/reservations', methods=['GET'])
@token_required
@admin_required
def get_reservations(current_user):
    reservations = Reservation.query.all()
    return jsonify([reservation.to_dict() for reservation in reservations]), 200

@app.route('/api/reservations/user', methods=['GET'])
@token_required
def get_user_reservations(current_user):
    reservations = Reservation.query.filter_by(user_id=current_user.id).all()
    return jsonify([reservation.to_dict() for reservation in reservations]), 200

@app.route('/api/reservations', methods=['POST'])
@token_required
def create_reservation(current_user):
    try:
        data = request.get_json()
        app.logger.info(f'Received reservation request data: {data}')
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        required_fields = ['roomId', 'checkIn', 'checkOut', 'guests', 'paymentMethod', 'totalPrice']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Check if room exists and is available
        room = Room.query.get(data['roomId'])
        if not room:
            return jsonify({'message': 'Room not found'}), 404
            
        if not room.available:
            return jsonify({'message': 'Room is not available'}), 400
        
        # Validate dates
        try:
            check_in = datetime.datetime.strptime(data['checkIn'], '%Y-%m-%d').date()
            check_out = datetime.datetime.strptime(data['checkOut'], '%Y-%m-%d').date()
            
            if check_in >= check_out:
                return jsonify({'message': 'Check-out date must be after check-in date'}), 400
                
            if check_in < datetime.datetime.now().date():
                return jsonify({'message': 'Check-in date cannot be in the past'}), 400
                
        except ValueError as e:
            app.logger.error(f'Date parsing error: {str(e)}')
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Create reservation
        try:
            new_reservation = Reservation(
                room_id=data['roomId'],
                user_id=current_user.id,
                check_in=check_in,
                check_out=check_out,
                guests=data['guests'],
                payment_method=data['paymentMethod'],
                total_price=data['totalPrice']
            )
            
            # Update room availability
            room.available = False
            
            db.session.add(new_reservation)
            db.session.commit()
            
            return jsonify(new_reservation.to_dict()), 201
            
        except Exception as db_error:
            db.session.rollback()
            app.logger.error(f'Database error: {str(db_error)}')
            return jsonify({'message': f'Database error: {str(db_error)}'}), 500
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f'Error creating reservation: {str(e)}')
        return jsonify({'message': f'Error creating reservation: {str(e)}'}), 500

@app.route('/api/reservations/<int:reservation_id>', methods=['DELETE'])
@token_required
def cancel_reservation(current_user, reservation_id):
    reservation = Reservation.query.get_or_404(reservation_id)
    
    # Check if user owns the reservation or is admin
    if reservation.user_id != current_user.id and not current_user.is_admin:
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Update room availability
    room = Room.query.get(reservation.room_id)
    room.available = True
    
    db.session.delete(reservation)
    db.session.commit()
    
    return jsonify({'message': 'Reservation cancelled successfully'}), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Check if tables exist
        tables = {
            'users': User.query.first() is not None,
            'rooms': Room.query.first() is not None,
            'reservations': Reservation.query.first() is not None
        }
        
        # Check database connection
        db.session.execute('SELECT 1')
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'tables': tables
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)