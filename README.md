# task-manager-api

task manager API is for recording tasks to accomplish, when accomplishing you can refer update it as completed 

this project has been built with NodeJS/Express server framwork and MongoDB database

Hosted to domain
https://hashem-task-manager.herokuapp.com

you can do:

  - Sign Up 
  Send json object with POST  method ->url/users
  {
    "name":name,
    "email":email
    "password":password
  }
  you get responded with user data and access token  to stay login
  
  -Sign In
   Send json object with POST  method ->url/users/login
  {
    "email":email
    "password":password
  }
  
-Log Out
    Call POST  method ->url/users/logout
    
   Note: You must be already registered to be able to log out 
   
-Log Out from all devices
  Call POST  method ->url/users/logoutall
  
-Delete User
 Call DELETE  method ->url/users/me
 
- Update User 
  Send json object with PATCH method ->url/users/me with fields to update
  {
    "name":name,
    "email":email
    "password":password
  }


-Fetch User by ID

call get method with url//users/:id

-User Profile

call GET with url/users/me


-Upload avatar or user profile

call POST with file attached to url/users/me/avatar



-Get user picture 

call GET method with url/users/:user_id/avatar


-Delete user pic

call DELETE with url/users/me/avatar

You should authenticate to perform tasks operation

-Create Task
  call POST method attached by task data  url/tasks
  {
    "description":'details about task',
    "completed":false or true
  }
-Fetch tasks 
 GET: /tasks/?completed=true or false //filter
//tasks?limit=count_num&skip=num_to_skip  //pagination
//tasks?sortBy=createdAt:desc


-Fetch single task by id
GET:url/tasks/:id

-Delete task by id
call DELETE:url/tasks/:id


-Update Task
call PATCH:url/tasks/:id
with fields to update
{
description:'',
completed:''
}

