import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GeolocationService } from '@app/services/geoloction.service';
import { HttpService } from '@app/services/http.service';
import { NotificationService } from '@app/services/notification.service';

interface Brewery{
  name: string;
  website: string;
  description: string;
}
interface Beer{
  name: string;
  abv: string;
  style: string;
  description: string;
  brewery: string;
  website: string;
}

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  userForm: FormGroup;
  curCoords: any;

  // Beer specific view
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

  // Brewery Specific view
  colsBrewery = [
    {
      name: 'name',
      header: "Name"
    },
    {
      name: 'website',
      header: "website"
    }
  ]

  colsBeersAtBrewery = [
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
      name: 'brewery',
      header: 'Brewery',
    },
    {
      name: 'website',
      header: 'Website',
    },
  ]

  // Used to track what wer are currently displaying
  curCols = this.cols;
  displayedColumns: string[] = this.curCols.map((e) => e.name);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  myData: any = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private geolocation: GeolocationService,
    private http: HttpService,
    private notifier: NotificationService
  ) {
    this.userForm = this.formBuilder.group(
      {
        searchType: new FormControl('', Validators.required),
        searchCriteria: new FormControl('', Validators.required)
      }
    );
  }

  ngOnInit(): void {
    // Get beer info
    this.http.getBeers().subscribe((data: any) => {
      console.log('beers:');
      console.log(data);
      this.dataSource = new MatTableDataSource(data.data);
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Find where the user is hiding
    this.geolocation.getLocation().subscribe((res) => {
      console.log(res.coords);
      this.curCoords = res.coords;
    });
  }

  onSubmit() {
      var searchType = this.userForm.get('searchType').value;
      var searchCriteria = this.userForm.get('searchCriteria').value;
      
      // For keyword only searches, just want to know all beers that match
      if(searchType === "Breweries by keyword"){
        this.http.getBreweriesKeyword(searchCriteria).subscribe((data: any) => {
          console.log(data.data);
          this.curCols = this.colsBrewery;
          this.displayedColumns = this.curCols.map((e) => e.name);
          this.dataSource = new MatTableDataSource(data.data);
        });
      }else if(searchType === "Beers by keyword"){
        this.http.getBeersKeyword(searchCriteria).subscribe((data: any) => {
          var processedData = processBeerList(data.data);
          console.log(processedData);
          this.curCols = this.colsBeersAtBrewery;
          this.displayedColumns = this.curCols.map((e) => e.name);
          this.dataSource = new MatTableDataSource(processedData);
        });
      }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

// Convert beer list from API to list of Beer objects
function processBeerList(data){
  var toReturn = [];
  for(var index in data){
    const curRow = data[index];

    // If they are too lazy to input a style,
    // then they are uninvited from the party
    if(curRow["style"] === undefined){
      continue;
    }

    const breweries = processBreweryList(curRow["breweries"]);
    for(var brewIndex in breweries){
      const curBrewery = breweries[brewIndex]
      const beer: Beer ={
        name: curRow["name"],
        abv: curRow["abv"],
        style: curRow["style"]["shortName"],
        description: curRow["description"],
        brewery: curBrewery["name"],
        website: curBrewery["website"]
      };
      toReturn.push(beer);
    }
  }
  return toReturn;
}

// Convert brewery list from API to list of Brewery objects
function processBreweryList(data){
  var toReturn = [];
  for(var index in data){
    const curRow = data[index];
    const brewery: Brewery ={
      name: curRow["name"],
      website: curRow["website"],
      description: curRow["description"],
    }
    toReturn.push(brewery);
  }
  return toReturn;
}
