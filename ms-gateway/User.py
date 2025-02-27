class User:
    def __init__(self, user_id, username, location, cameras):
        self.user_id = user_id
        self.username = username
        self.location = location
        self.cameras = cameras

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'location': self.location,
            'cameras': [camera.to_dict() for camera in self.cameras]
        }

    @staticmethod
    def from_dict(data):
        cameras = [Camera.from_dict(camera_data) for camera_data in data['cameras']]
        return User(data['user_id'], data['username'], data['location'], cameras)


class Camera:
    def __init__(self, camera_id, name, location):
        self.camera_id = camera_id
        self.name = name
        self.location = location

    def to_dict(self):
        return {
            'camera_id': self.camera_id,
            'name': self.name,
            'location': self.location
        }

    @staticmethod
    def from_dict(data):
        return Camera(data['camera_id'], data['name'], data['location'])
