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
} from '@app/models/brewTypes';
import { SpinnerService } from '@app/services/spinner.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  userForm: FormGroup;
  curCoords: any;

  // Used to track what we are currently displaying
  curBrews: Brews;
  curCols: Array<any>;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private geolocation: GeolocationService,
    private http: HttpService,
    private notifier: NotificationService,
    private spinner: SpinnerService
  ) {
    this.userForm = this.formBuilder.group({
      searchType: new FormControl('', Validators.required),
      searchCriteria: new FormControl('', Validators.required),
    });
  }

  updateModel(brews: Brews, data) {
    return new Promise((resolve, reject) => {
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
      this.dataSource.data = processedData;
      console.log('processed data');
      console.log(this.dataSource);

      resolve();
    });
  }

  ngOnInit(): void {
    this.spinner.on();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Get beer info
    this.http.getBeers().subscribe(async (data: any) => {
      await this.updateModel(new Beers(), data.data);
      this.spinner.off();
    });

    // Find where the user is hiding
    this.geolocation.getLocation().subscribe((res) => {
      console.log(res.coords);
      this.curCoords = res.coords;
    });
  }

  onSubmit() {
    this.spinner.on();

    var searchType = this.userForm.get('searchType').value;
    var searchCriteria = this.userForm.get('searchCriteria').value;

    if (searchCriteria === '' && (searchType === 'Search Breweries by Keyword' || searchType === 'Search Beers by Keyword')) {
      this.notifier.showWarning('Search criteria invalid!', '');
      this.spinner.off();
      return;
    }

    // For keyword only searches, just want to know all beers that match
    if (searchType === 'Search Breweries by Keyword') {
      this.http.getBreweriesKeyword(searchCriteria).subscribe(async (data: any) => {
        await this.updateModel(new Breweries(), data.data);
        this.spinner.off();
      });
    } else if (searchType === 'Search Beers by Keyword') {
      this.http.getBeersKeyword(searchCriteria).subscribe(async (data: any) => {
        await this.updateModel(new BeersWithBreweries(), data.data);
        this.spinner.off();
      });
    } else if (searchType === 'Get All Breweries') {
      this.http.getBreweries().subscribe(async (data: any) => {
        await this.updateModel(new Beers(), data.data);
        this.spinner.off();
      });
    } else if (searchType === 'Get All Beers') {
      this.http.getBeers().subscribe(async (data: any) => {
        await this.updateModel(new Beers(), data.data);
        this.spinner.off();
      });
    } else {
      this.notifier.showError('Unknown search type!', '');
      this.spinner.off();
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
