"use strict";
//Class defining the dot that pacman character tries to catch
class NewTask
{
    //Constructor for co-ordinates, radius, coulour and context.
    constructor(name, content)
    {
        this.name = name;
        this.content = content;
        //Hardcoded values below (for now)
        this.status = 0;
        this.importance = 0;
        this.until = "12/10/2016";
        this.ttl = 1200;
    }
}