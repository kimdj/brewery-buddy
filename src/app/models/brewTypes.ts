/***************************************************************
 
        Base Classes.  The singular (Brew) is used to store the
        Data that is returned from the API request.  The plural
        (Brews) is sued to handle parsing the data from the API
        request as well as having header info for displaying

****************************************************************/
export class Brew {
  constructor(public name: string) {}
}

export class Brews {
  cols = [
    {
      name: 'name',
      header: 'header',
    },
  ];

  // Stores the parsed objects for future use.
  brews: Array<Brew>;

  constructor() {
    this.brews = [];
  }

  // Data is the raw data portion of API request
  process(data: Array<any>): Array<any> {
    this.brews = [];
    for (var index in data) {
      var newBrew = this.processRow(data[index])
      this.brews.push(newBrew);
    }
    return this.brews;
  }

  // Creates new object based on each row returned
  processRow(data: any) {
    return new Brew(data['name']);
  }
}


/**************************************************************
 
        Beer represents just a beer.  Beers represents a bunch
        of related beers

**************************************************************/

export class Beer extends Brew {
  constructor(
    name: string,
    public id: string,
    public abv: string,
    public styleId: string,
    public status: string
  ) {
    super(name);
  }
}

export class Beers extends Brews {
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

  processRow(data: any) {
    return new Beer(
      data['name'],
      data['id'],
      data['abv'],
      data['styleId'],
      data['status']
    );
  }
}

/**************************************************************
 
        Brewery represents a brewery company. It might have many
        different locations.
        
**************************************************************/
export class Brewery extends Brew {
  constructor(name: string, public website: string,
    public description: string, public established: string,
    public updateDate: string) {
    super(name);
  }
}
export class Breweries extends Brews {
  cols = [
    {
      name: 'name',
      header: 'Name',
    },
    {
      name: 'established',
      header: 'Established',
    },
    {
      name: 'updateDate',
      header: 'Last Updated',
    },
  ];

  brews: Array<Brewery>;

  processRow(data: any) {
    return new Brewery(data['name'], data['website'],
     data['description'], data['established'], data['updateDate']);
  }
}

/**************************************************************
 
        Brewery location represents a brewery site. It might have many
        different locations.
        
**************************************************************/

export class BreweryLocation extends Brew {
  constructor(
    name: string,
    public website: string,
    public distance: string, 
    public brewery: Brewery,
    public latitude: string,
    public longitude: string,
    public locality: string,
    public address: string) {
    super(name);
  }
}
export class BreweryLocations extends Brews {
  cols = [
    {
      name: 'name',
      header: 'Name',
    },
    {
      name: 'locality',
      header: 'Location',
    },
    {
      name: 'streetAddress',
      header: 'Address',
    }
  ];

  brews: Array<BreweryLocation>;

  processRow(data: any) {
    const breweries = new Breweries();
    var results = breweries.process([data.brewery]);
    return new BreweryLocation(
      data['name'], 
      data['website'],
      data["distance"], 
      breweries.brews[0],
      data['latitude'], 
      data['longitude'],
      data["locality"],
      data["streetAddress"]);
  }
}

/**************************************************************
 
        BeerWithBrewery represents a beer that is made by a
        specific Brewery.
        
**************************************************************/

export class BeerWithBrewery extends Brew {
  constructor(
    name: string,
    public abv: string,
    public style: string,
    public breweries: Array<Brewery>,
    public description: string,
    public ibu: string,
  ) {
    super(name);
  }
  getBreweries(){
    return this.breweries;
  }
}
export class BeersWithBreweries extends Brews {
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
    {
      name: 'ibu',
      header: 'IBU',
    },
  ];

  brews: Array<BeerWithBrewery>;

  process(data: Array<any>): Array<any> {
    this.brews = [];
    var toReturn = [];
    for (var index in data) {
      const curRow = data[index];
      
      // If they are too lazy to input a style,
      // then they are uninvited from the party
      if(curRow["style"] === undefined){
        continue;
      }     

      var newBeer = this.processRow(curRow);
      this.brews.push(newBeer);

      // Data chart does not understand nested structures,
      // so we have to flatten the sub-breweries
      newBeer.getBreweries().forEach((brewery) =>{
        toReturn.push({
          name : newBeer["name"],
          abv : newBeer["abv"],
          style: newBeer["style"],
          brewery: brewery["name"],
          website: brewery["website"]
        });
      });
    }
    return toReturn;
  }

  processRow(data: any) {
    const breweries = new Breweries();
    var results = breweries.process(data['breweries']);
    return new BeerWithBrewery(data['name'], data['abv'],
      data["style"]["shortName"], results, data["description"], data["ibu"]);
  }
}

export interface Event{
  name: string;
  website: string;
  description: string;
}

export class Location extends Brew {
  constructor(
    name: string,
    public streetAddress: string,
    public latitude: string,
    public longitude: string,
    public locality: string
  ) {
    super(name);
  }
}
export class Locations extends Brews {

  brews: Array<Location>;

  processRow(data: any) {
    const breweries = new Breweries();
    var results = breweries.process([data.brewery]);
    return new Location(
      data['name'], 
      data['streetAddress'],
      data["latitude"], 
      data["longitude"], 
      data["locality"]);
  }
}