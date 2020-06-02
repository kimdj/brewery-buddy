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
import {
  Brews,
  Beers,
  Breweries,
  BeersWithBreweries,
} from '@app/models/BrewTypes';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  userForm: FormGroup;
  curCoords: any;

  // Used to track what wer are currently displaying
  curBrews: Brews;
  curCols: Array<any>;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private geolocation: GeolocationService,
    private http: HttpService,
    private notifier: NotificationService
  ) {
    this.userForm = this.formBuilder.group({
      searchType: new FormControl('', Validators.required),
      searchCriteria: new FormControl('', Validators.required),
    });
  }

  updateModel(brews: Brews, data) {
    console.log('Raw data');
    console.log(data);

    this.curBrews = brews;
    console.log('New Brew type');
    console.log(this.curBrews);

    this.curCols = this.curBrews.cols;
    console.log('New cols');
    console.log(this.curCols);

    this.displayedColumns = this.curCols.map((e) => e.name);
    console.log('New displaye columns');
    console.log(this.displayedColumns);

    const processedData = this.curBrews.process(data);
    this.dataSource = new MatTableDataSource(processedData);
    console.log('processed data');
    console.log(this.dataSource);
  }

  ngOnInit(): void {
    // Get beer info
    this.http.getBeers().subscribe((data: any) => {
      this.updateModel(new Beers(), data.data);
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
    if (searchType === 'Breweries by keyword') {
      this.http.getBreweriesKeyword(searchCriteria).subscribe((data: any) => {
        this.updateModel(new Breweries(), data.data);
      });
    } else if (searchType === 'Beers by keyword') {
      this.http.getBeersKeyword(searchCriteria).subscribe((data: any) => {
        this.updateModel(new BeersWithBreweries(), data.data);
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
