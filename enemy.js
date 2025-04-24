class Enemy { // The enemy class
    constructor(tileX, tileY, currentHealth, maxHealth, damage, weapon, movement, value, level){
        this.tileX = tileX; // which vertical tile is the player on
        this.tileY = tileY; // which horizontal tile is the player on
        this.currentHealth = currentHealth; // current hp
        this.maxHealth = maxHealth; // the max health the player has
        this.damage = damage; // base damage
        this.weapon = weapon; //future for diff tile attacks
        this.movement = movement; // tiles the enemy can move
        this.value = value; // amount of gold dropped
        this.level = level; // how strong the enemy is
    }
}
