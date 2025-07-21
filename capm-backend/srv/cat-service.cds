using catalogservice as my from '../db/schema';

service CatalogService {
  entity Forms as projection on my.Forms;
  entity FormSubmissions as projection on my.FormSubmissions;
}
