"use strict";
//Class defining update details needed for update of user details, not including password.
class UserUpdateAll
{
    //Constructor parameters are general user details.
    constructor(email, firstname, surname, dob)
    {
        this.email = email;
        this.firstname = firstname;
        this.surname = surname;
        this.dob = dob;
    }
}