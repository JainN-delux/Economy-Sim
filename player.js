class Player { // The player class
    constructor(tileX, tileY, currentHealth, maxHealth, damage, weapon, movement, level){
        this.tileX = tileX; // which vertical tile is the player on
        this.tileY = tileY; // which horizontal tile is the player on
        this.currentHealth = currentHealth; // current hp
        this.maxHealth = maxHealth; // the max health the player has
        this.damage = damage; // the base damage the player does
        this.weapon = weapon; //future for diff tile attacks
        this.movement = movement; // how many tiles the player can move in a turn
        this.level = level; // how strong the player is
  }
}