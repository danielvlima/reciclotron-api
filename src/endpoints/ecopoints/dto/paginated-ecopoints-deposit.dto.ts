export class PaginatedEcopointsDepositDto {
  lat: number;
  long: number;
  hasItemForBox: boolean;
  city?: string;
  skip: number;
  take: number;
}
