import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GeolocationService } from '@app/services/geoloction.service';
import { HttpService } from '@app/services/http.service';
import { NotificationService } from '@app/services/notification.service';
import {
  Brews,
  Beers,
  Breweries,
  BeersWithBreweries,
  BreweryLocations,
} from '@app/models/brewTypes';
import { SpinnerService } from '@app/services/spinner.service';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnInit {
  /***********************************************************************************/

  expandedElement: any;
  objectKeys = Object.keys;

  /***********************************************************************************/

  userForm: FormGroup;
  curCoords: any;

  // Used to track what we are currently displaying
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
    private notifier: NotificationService,
    private spinner: SpinnerService
  ) {
    this.dataSource = new MatTableDataSource([]);

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

      this.displayedColumns = ['arrow'].concat(this.curCols.map((e) => e.name));
      console.log('New displayed columns');
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

    // Get all breweries
    this.http.getBreweries().subscribe(async (data: any) => {
      await this.updateModel(new Breweries(), data.data);
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

    if (searchCriteria === '' && searchType !== 'Breweries Nearby') {
      this.notifier.showWarning('Search criteria invalid!', '');
      this.spinner.off();
      return;
    }

    // For keyword only searches, just want to know all beers that match
    if (searchType === 'Breweries by Keyword') {
      this.http
        .getBreweriesKeyword(searchCriteria)
        .subscribe(async (data: any) => {
          await this.updateModel(new Breweries(), data.data);
          this.spinner.off();
        });
    } else if (searchType === 'Beers by Keyword') {
      this.http.getBeersKeyword(searchCriteria).subscribe(async (data: any) => {
        await this.updateModel(new BeersWithBreweries(), data.data);
        this.spinner.off();
      });
    }else if (searchType === 'Breweries Nearby') {
      // Default to denver, because I know it will work:)
        var lat = "39.7236683";
        var long = "-105.0006015";
        this.http.getCloseBreweries(this.curCoords.latitude, this.curCoords.longitude).subscribe(async data =>{
          if(data["data"] === undefined){
            this.http.getCloseBreweries(lat, long).subscribe( async data =>{
              await this.updateModel(new BreweryLocations(), data["data"]);
              this.spinner.off();
            });
          }else{
            await this.updateModel(new BreweryLocations(), data["data"]);
            this.spinner.off();
          }     
        });
    this.http.getBeersKeyword(searchCriteria).subscribe(async (data: any) => {
      await this.updateModel(new BeersWithBreweries(), data.data);
      this.spinner.off();
    });
  }else {
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

  /***********************************************************************************/

  onClickTabs(event: MatTabChangeEvent, sample: any) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
    console.log('sample => ', sample);
  }

  /***********************************************************************************/
}
