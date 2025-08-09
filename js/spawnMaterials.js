class Materials{
    constructor(spriteGroup, noOfSprites, spriteImg, scale, isFloating = false){
        

        this.noOfSprites= noOfSprites;
        this.spriteImg= spriteImg;
        this.spriteGroup= spriteGroup;
        this.scale= scale;
        this.isFloating = isFloating;
    }

    spawnMaterials(){
        for (let i = 0; i < this.noOfSprites; i++) {
            var x, y;
            x= Math.round(random(width/2-250, width/2+300));
            y= Math.round(random(-height*5, height-500));

            var material= createSprite(x, y);
            material.addImage(this.spriteImg);
            material.scale= this.scale;
            this.spriteGroup.add(material);
           // material.debug= true;
            if (this.isFloating) {
                // Add floating effect for obstacles
                material.oscillationOffset = random(0, 10); // Random offset for floating
                material.floatingSpeed = random(0.5, 1.5); // Random speed for floating
              }

          //  console.log(i);
        }
    }

    spawnObstacles(){
        for (let i = 0; i < this.noOfSprites; i++) {
            var x, y;
            x= Math.round(random(width/2-250, width/2+300));
            y= Math.round(random(-height*5, height-500));

            var material= createSprite(x, y);
            material.addImage(this.spriteImg);
            material.scale= this.scale;
            material.setCollider("circle", 0, 0, 100);
           // material.debug= true;
            this.spriteGroup.add(material);

           // console.log(i);
        }
    }

    spawnFloatingObstacles() {
        for (let i = 0; i < this.noOfSprites; i++) {
            var x, y;
            x= Math.round(random(width/2-250, width/2+300));
            y= Math.round(random(-height*5, height-500));
    
          var obstacle = createSprite(x, y);
          obstacle.addImage(this.spriteImg);
          obstacle.scale = this.scale;
         // obstacle.setCollider("circle", 0, 0, 100);
          this.spriteGroup.add(obstacle);
      //    obstacle.debug= true;
          // Add floating effect for obstacles
          obstacle.oscillationOffset = random(0, 10); // Random offset for floating
          obstacle.floatingSpeed = random(0.5, 1.5); // Random speed for floating
        }
      }

    updateFloating() {
        if (this.isFloating) {
            this.spriteGroup.forEach((material) => {
              // Apply floating effect using sine wave for oscillation
              material.position.y += sin((frameCount + material.oscillationOffset) * 0.1) * material.floatingSpeed;
            });
    }
}
}