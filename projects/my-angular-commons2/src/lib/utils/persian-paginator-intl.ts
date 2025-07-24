import { MatPaginatorIntl } from "@angular/material/paginator";

const persianRangeLabel = (page: number, pageSize: number, length: number) => { 
	if (length == 0 || pageSize == 0) 
		return `0 از ${length}`; 
	
	length = Math.max(length, 0); 
	const startIndex = page * pageSize; 
	const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; 
	return `${startIndex + 1} - ${endIndex} از ${length}`; 
}

export function getPersianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'تعداد در هر صفحه:';
  paginatorIntl.nextPageLabel = 'صفحه بعدی';
  paginatorIntl.previousPageLabel = 'صفحه قبلی';
  paginatorIntl.getRangeLabel = persianRangeLabel;
  paginatorIntl.lastPageLabel = 'صفحه آخر';
  paginatorIntl.firstPageLabel = 'صفحه اول';
  
  return paginatorIntl;
}