class Enemy { // The enemy class
    constructor(tileX, tileY, maxHealth, damage, weapon, movement, state){
        this.tileX = tileX; // which vertical tile is the enemy on
        this.tileY = tileY; // which horizontal tile is the enemy on
        this.currentHealth = maxHealth; // current hp
        this.maxHealth = maxHealth; // the max health the enemy has
        this.damage = damage; // base damage
        this.weapon = weapon; //future for diff tile attacks
        this.movement = movement; // tiles the enemy can move
        this.state = "move"
        // this.value = value; // amount of gold dropped
        // this.level = level; // how strong the enemy is
    }

    
}
