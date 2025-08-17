# DataCarte
A web-based application used to help schools manage their data. Assists students with compliance of activity requirements, helps teachers in conveniently accessing accurate data, and allows parents to monitor their children's academic progress.

## Features  
### Students can:  
- Access data with ease  
- Be notified of undone activities  
- See which activities are due  
- Attach files to a classroom (only visible to teachers)

### Teachers can:  
- Create, read, and update data of the activities complied by students  
- Post, update, and delete activities  
- Access data from the classrooms  
- Leave notes for students

### Parents can:  
- Monitor their children's academic progress
- Retrieve report cards of their children online

## Requirements
### Front-end
- React  
- Chakra-ui  
- Framer-animation  
- Axios  
- React-icons

### Back-end
- Node.js  
- Express  
- MongoDB  
- Mongoose  
- Cors  
- Jsonwebtoken  
- Dotenv  
- Bcrypt  
- Body-parser  
- Morgan  
- Helmet  
- Cookie-parser  
- Nodemon

## Installation  
<pre>  
```bash  
git clone https://github.com/riyel/DataCarte.git  
cd DataCarte  
cd frontend  
npm install react react-dom react-router-dom axios @chakra-ui/react @emotion/react framer-motion react-icons  
npm run build  
cd ../backend  
npm install express cors dotenv jsonwebtoken bcrypt mongoose helmet morgan cookie-parser  
npm install --save-dev nodemon  
```  
</pre>  

## Usage  
1. Create a .env file in the backend folder and add the following:  
<pre>  
```bash  
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.0c9i.mongodb.net/<database>?retryWrites=true&w=majority  
JWT_SECRET=<secret>  
CORS_ORIGIN=<port>
```  
</pre>  
2. Run the backend server with nodemon:  
<pre>  
```bash  
npm run start  
```  
</pre>  
3. Access the server at the chosen port.  
