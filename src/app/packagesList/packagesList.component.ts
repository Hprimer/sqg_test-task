import { Component, OnInit } from '@angular/core';
import { PackagesService } from '../packages/packages.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-packagesList',
  standalone: true,
  imports: [ HttpClientModule],
  templateUrl: './packagesList.component.html',
  styleUrls: ['./packagesList.component.scss']
})
export class PackagesListComponent implements OnInit {
  packages: Package[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private packagesService: PackagesService) {}

  ngOnInit(): void {
    this.packagesService.getPackages().subscribe({
      next: (data) => {
        this.packages = this.changeFormat(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Не удалось загрузить данные';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  private changeFormat(packages: Package[]): Package[] {
    return packages.map(pkg => {

      const pkgCopy = {...pkg};
      const downloads:number = pkgCopy.weeklyDownloads;
      const dependecies = pkgCopy.dependencyCount;
      
      if (downloads >= 1000 && downloads < 1000000) {
        pkgCopy.weeklyDownloads = `${Math.round(downloads/1000)}K`;
      } else if (downloads >= 1000000) {
        pkgCopy.weeklyDownloads = `${Math.round(downloads/1000000)}M`;
      }

      if (dependecies > 1)
        pkgCopy.dependencyCount = `${dependecies} dependencies`
      else pkgCopy.dependencyCount = `${dependecies} dependency`

      return pkgCopy;
    });
  }
}