export interface Package {
  id: string;
	dependencyCount: number ;
  weeklyDownloads: number ;
}

export interface ChangedFormatPackage {
  id: string;
	dependencyCount: string;
  weeklyDownloads: string;
}