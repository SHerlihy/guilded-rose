type ShopUpdate = {
    sellIn: number,
    quality: number
}

type ShopRule = (sellIn: number, quality: number) => ShopUpdate
type ShopRules = Record<string, ShopRule>

const handleQualityBounds = (curQuality: number) => {
    if(curQuality > 50){
        return 50
    }

    if(curQuality < 0) {
        return 0
    }

    return curQuality
}

const passedSellIn = (sellIn: number) => {
    if(sellIn<0){
        return true
    }

    return false
}

type HandleQualityTick = (quality: number, sellIn: number)=>number

const handleQualityTickGeneric: HandleQualityTick = (quality, sellIn) =>{
    const isPassedSell = passedSellIn(sellIn)

    if (isPassedSell){
        quality-=2
    } else {
        quality--
    }

    return quality
}

const handleQualityTickAgedBrie: HandleQualityTick = (quality, sellIn) =>{
    const isPassedSell = passedSellIn(sellIn)

    if (isPassedSell){
        quality+=2
    } else {
        quality++
    }

    return quality
}

const handleQualityTickConcertTickets: HandleQualityTick = (quality, sellIn) =>{
    const isPassedSell = passedSellIn(sellIn)

    if (isPassedSell){
        return 0
    }

    if (sellIn < 6){
        return quality+3
    }

    if (sellIn < 11){
        return quality+2
    }

    return quality+1
}

const nonLegends = (prevSellIn: number, prevQuality: number, handleQualityTick: HandleQualityTick) => {
    const curQuality = handleQualityTick(prevQuality, prevSellIn)

    const curSellIn = prevSellIn-1

    return {
        sellIn: curSellIn,
        quality: handleQualityBounds(curQuality)
    }
}

const handleTickGeneric = (prevSellIn: number, prevQuality: number): ShopUpdate => {
    return nonLegends(prevSellIn, prevQuality, handleQualityTickGeneric)
}

const handleTickAgedBrie = (prevSellIn: number, prevQuality: number): ShopUpdate => {
    return nonLegends(prevSellIn, prevQuality, handleQualityTickAgedBrie)
}

const handleTickConcertTickets = (prevSellIn: number, prevQuality: number): ShopUpdate => {
    return nonLegends(prevSellIn, prevQuality, handleQualityTickConcertTickets)
}

const rules: ShopRules = {
    "generic": (sellIn: number, quality: number)=>handleTickGeneric(sellIn, quality),
    "Aged Brie": (sellIn: number, quality: number)=>handleTickAgedBrie(sellIn, quality),
    "Backstage passes": (sellIn: number, quality: number)=>handleTickConcertTickets(sellIn, quality),
    "Sulfuras": (sellIn: number, quality: number)=>{return {sellIn, quality}}
}

export class Item {
  name: string;
  sellIn: number;
  quality: number;
  rules = rules;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }

  public tick(){
    let shopUpdate: ShopUpdate;

    if (this.rules[this.name] === undefined){
        shopUpdate = this.rules["generic"](this.sellIn, this.quality)
    } else {
        shopUpdate = this.rules[this.name](this.sellIn, this.quality)
    }

    this.sellIn = shopUpdate.sellIn
    this.quality = shopUpdate.quality
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
        this.items[i].tick()
    }

    return this.items;
  }
}
