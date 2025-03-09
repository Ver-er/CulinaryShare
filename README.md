# Culinary Share - Recipe Sharing Platform

![Culinary Share Logo](https://img.icons8.com/color/96/000000/cooking-book.png)

Culinary Share is a full-stack web application that allows users to discover, create, and save recipes. Built with the MERN stack (MongoDB, Express.js, React.js, and Node.js), this platform provides a seamless experience for cooking enthusiasts to share their culinary creations.

## Features

- **User Authentication**: Register, login, and manage user sessions
- **Recipe Discovery**: Browse a collection of recipes on the homepage
- **Recipe Creation**: Create and publish your own recipes
- **Recipe Saving**: Save your favorite recipes to your personal collection
- **Responsive Design**: Enjoy a seamless experience on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Web Vitals

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/culinary-share.git
   cd culinary-share
   ```

2. Install backend dependencies
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../client
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
   - Create a `.env` file in the client directory
   - Add the following variables:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```
   - In production, update REACT_APP_API_URL to point to your deployed backend

### Running the Application

1. Start the backend server
   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Logout user

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a specific recipe
- `POST /api/recipes` - Create a new recipe (requires authentication)
- `PUT /api/recipes/:id` - Update a recipe (requires authentication)
- `DELETE /api/recipes/:id` - Delete a recipe (requires authentication)

### Saved Recipes
- `POST /api/recipes/:id/save` - Save a recipe to user's collection
- `DELETE /api/recipes/:id/save` - Remove a recipe from user's collection
- `GET /api/users/:id/saved` - Get user's saved recipes

## Project Structure

```
culinary-share/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   ├── .env                # Frontend environment variables
│   └── src/                # React source files
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── pages/          # Page components
│       └── utils/          # Utility functions
│
└── server/                 # Backend Express application
    ├── .env                # Backend environment variables
    ├── controllers/        # Route controllers
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    └── routes/             # API routes
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Icons8](https://icons8.com/) for the logo 