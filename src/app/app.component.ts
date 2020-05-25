import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from './services/spinner.service';
import { NotificationService } from './services/notification.service';
import { HttpService } from './services/http.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Brewery Buddy';
  innerWidth = 0;
  isMobileHeaderHidden = '0';
  previousPageYOffset = 0;
  currentPageYOffset = window.pageYOffset;
  
  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }

  @HostListener('window:scroll', ['$event']) 
  doSomething(event) {
    this.currentPageYOffset = window.pageYOffset;

    // console.log("Scroll Event", window.pageYOffset);
    // console.log("Scroll Event", this.previousPageYOffset);

    // If scrolling up or at the top, reveal the navbar.  Otherwise, hide it.
    if ((this.previousPageYOffset > window.pageYOffset) || (window.pageYOffset <= 0)) {
      this.isMobileHeaderHidden = '0';
      // console.log('SCROLLING UP');
    } else {
      this.isMobileHeaderHidden = '-500px';
      // console.log('SCROLLING DOWN');
    }

    this.previousPageYOffset = window.pageYOffset;
  }

  constructor(private spinner: SpinnerService,
              private sanitizer: DomSanitizer,
              private notifier: NotificationService,
              private http: HttpService) {
    // Create 100 users
    const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    let foo = this.http.getBreweries().subscribe((data) => {
      this.notifier.showInfo('foo', 'bar');
      console.log('getBreweries() data:');
      console.log(data);
    });

    // let beers = this.http.getBeers().subscribe((data) => {
    //   console.log('getBeers() data:');
    //   console.log(data);
    // });

    this.innerWidth = window.innerWidth;
    // this.spinner.on();
    // setTimeout(() => {
    //   this.notifier.showSuccess('foo', 'bar');
    // }, 0);
    // setTimeout(() => {
    //   this.notifier.showError('foo', 'bar');
    // }, 2000);
    // setTimeout(() => {
    //   this.notifier.showWarning('foo', 'bar');
    // }, 4000);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}