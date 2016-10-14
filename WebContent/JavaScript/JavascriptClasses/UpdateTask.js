"use strict";
//Class defining a task that is being updated
class UpdateTask
{
    //Constructor parameters are the id of the task for update, task name and content. 
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