"use strict";
//Class defining the dot that pacman character tries to catch
class UpdateTask
{
    //Constructor for co-ordinates, radius, coulour and context.
    constructor(id, name, content)
    {
    	this.id = id;
        this.name = name;
        this.content = content;
        //Hardcoded values below (for now)
        this.status = 0;
        this.importance = 0;
        this.until = "12/10/2016";
        this.ttl = 1200;
    }
}