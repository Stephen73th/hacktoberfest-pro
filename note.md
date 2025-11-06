




# Creating  the GitHub repo
# Creating Mongodb account

#  Mongodb - connected Mongodb


# INSTALLATIONS
# 1. Install express - npm install express
# 2. Install nodemon - npm install nodemon -D
# 3. Install dotenv - npm install dotenv
# 4. Install cors - npm install cors
# 5. Install cookie-parser - npm install cookie-parser
# 6. Install Mongoose - npm install mongoose
# 7. Jweb token and bcrypt - npm install jsonwebtoken bcryptjs
# 8. Installed node-cron - npm install node-cron


# Project setup 
# folder structure
# Model 



# Signup Model (Name, Email, Password, Confirm Password, Tracks)



Steps: 
1. Connect to Mongodb
2. Created an admin model
3. .env config to hide sensitive informations ()
4. Build the controller logic {Signup, signin}

model ==> controller ==> router ==> server.js

# Imported cookie parser to the server.js
express.json 
downloaded httpie to test our server
learnt about status code


introduced a third parameter called 'next' in the async function (auth.controller);
listens, prepare and respond

1. # req - Request object
Contains what the user is sending to your app

# Request types:

req.body - (datas like email, tracks, name, password)
req.params - (datas that are part of the url -- e.g "/users/id: ")
req.query
req.headers

name
{
    "name": "Eny Jone"
    "email": "try@gmail.com"
    "password": "7yhgkf",
    "Track": "Fullstack"
} = req.body

2. # res - Response Object
Note : Every  request is backed up with a response


types of response
res.send
res.json (an object)
res.staus (404 - Not found, 200 - ok, 201 - created succesfully, 401, 500)

# example - 
res.send("Signup successful")

res.json({
    message: "Signup successfully",
    name: "Steve"
})

3. # next - an express function that tracks progress

Ensures the user moves to the next task

4. Status Code -

a. anything that is 1... - information
b. anything 2... - successful 
c. anything 3.. - redirection
d. anything 4... - client error
e. anything 5... - server error

200 - OK 
example res.status(200).json({message: "Login successful"})

201 - created succesfully

204 - No content

400 - bad request





