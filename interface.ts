export interface ProviderItem {
    _id: string,
    name: string,
    address: string,
    tel: string,
    __v: number,
  }
  
export interface ProviderJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: ProviderItem[]
  }

export interface BookingItem {
    user: string;
    provider: string;
    bookDate: string;
  }