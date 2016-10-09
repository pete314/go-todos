"use strict";
//Class defining the dot that pacman character tries to catch
class UserLogin
{
    //Constructor for co-ordinates, radius, coulour and context.
    constructor(password, email)
    {
        this.password = password;
        this.email = email;
        this.client_id = "76256f9f-0486-401b-a242-a6f52a77784b";
        this.client_secret = "9190f10a35c99be0fc6522b7eaa14edbdf7e40e347057f00909bd20a98a82b44";
        this.grant_type = "client_credentials";
    }
}