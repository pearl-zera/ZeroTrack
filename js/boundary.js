class Boundary{

    constructor(x, y, w, h){
        this.x= x;
        this.y= y;
        this.w= w;
        this.h= h;
        this.wall= createSprite(this.x, this.y, this.w, this.h);

    }

    display(){
       
    this.wall.visible=false;
     
    }

    collisionWboat(){
    boat.collide(this.wall);
    }
}