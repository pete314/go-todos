"use strict";
//Class defining and brand new task
class NewTask
{
    //Constructor parameters are the task name and content, some other hardcoded values for now
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