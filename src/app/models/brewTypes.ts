  export class Brew{
    constructor(private name: string){
    }
  }

  export class Brews{
    cols =[
    {
        name: 'name',
        header: 'header',
    }];

    brews: Array<Brew>;

    constructor(){
        this.brews = [];
    }

    process(data: Array<any>): Array<any>{
        this.brews = [];
        for(var index in data){
          this.brews.push(data[index]);
        }
        return this.brews;
    }

    processRow(data: any){
        return new Brew(data["name"])
    }
  }

  export class Beer extends Brew{
    constructor(name: string, private id: string,
         private abv: string, private styleId: string,
         private status: string){
        super(name);
    } 
  }
  export class Beers extends Brews{
    cols = [
        {
          name: 'id',
          header: 'ID',
        },
        {
          name: 'name',
          header: 'Name',
        },
        {
          name: 'abv',
          header: 'ABV',
        },
        {
          name: 'styleId',
          header: 'Style ID',
        },
        {
          name: 'status',
          header: 'Status',
        },
      ];
      brews: Array<Beer>;
    
      processRow(data: any){
          return new Beer(data["name"], data["id"], data["abv"],
           data["styleId"], data["status"]);
      }
  }

  export class Brewery extends Brew{
    constructor(name: string, private website: string){
        super(name);
    } 
  }
  export class Breweries extends Brews{
    cols = [
        {
        name: 'name',
        header: "Name"
        },
        {
        name: 'website',
        header: "website"
        }
    ]

    brews: Array<Brewery>;

    processRow(data: any){
        return new Brewery(data["name"], data["website"])
    }
  }

  export class BeerWithBrewery extends Brew{
    constructor(
        name: string,
        private abv: string,
        private style: string){
            super(name);
        } 
  }
  export class BeersWithBreweries extends Brews{
        cols = [
        {
          name: 'name',
          header: 'Name',
        },
        {
          name: 'abv',
          header: 'ABV',
        },
        {
          name: 'style',
          header: 'Style',
        },
        // {
        //   name: 'brewery',
        //   header: 'Brewery',
        // },
        // {
        //   name: 'website',
        //   header: 'Website',
        // },
      ]

      brews: Array<BeerWithBrewery>;
    
      processRow(data: any){
          return new BeerWithBrewery(data["name"], data["abv"], "test");
      }
    //   process(data){
    //     var toReturn = [];
    //     for(var index in data){
    //       const curRow = data[index];
      
    //       // If they are too lazy to input a style,
    //       // then they are uninvited from the party
    //       if(curRow["style"] === undefined){
    //         continue;
    //       }
      
    //       const breweries = processBreweryList(curRow["breweries"]);
    //       for(var brewIndex in breweries){
    //         const curBrewery = breweries[brewIndex]
    //         const beer: Beer ={
    //           name: curRow["name"],
    //           abv: curRow["abv"],
    //           style: curRow["style"]["shortName"],
    //           description: curRow["description"],
    //           brewery: curBrewery,
    //         };
    //         toReturn.push(beer);
    //       }
    //     }
    //     return toReturn;
    // }
  }
// // Convert beer list from API to list of Beer objects
// function processBeerList(data){
//     var toReturn = [];
//     for(var index in data){
//       const curRow = data[index];
  
//       // If they are too lazy to input a style,
//       // then they are uninvited from the party
//       if(curRow["style"] === undefined){
//         continue;
//       }
  
//       const breweries = processBreweryList(curRow["breweries"]);
//       for(var brewIndex in breweries){
//         const curBrewery = breweries[brewIndex]
//         const beer: Beer ={
//           name: curRow["name"],
//           abv: curRow["abv"],
//           style: curRow["style"]["shortName"],
//           description: curRow["description"],
//           brewery: curBrewery,
//         };
//         toReturn.push(beer);
//       }
//     }
//     return toReturn;
//   }
  
//   // Convert brewery list from API to list of Brewery objects
//   function processBreweryList(data){
//     var toReturn = [];
//     for(var index in data){
//       const curRow = data[index];
//       const brewery: Brewery ={
//         name: curRow["name"],
//         website: curRow["website"],
//         description: curRow["description"],
//       }
//       toReturn.push(brewery);
//     }
//     return toReturn;
//   }