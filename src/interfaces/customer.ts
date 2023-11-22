export default interface CustomerObject {
    GivenName: string;
    PrimaryEmailAddr: {
      Address: string;
    };
    PrimaryPhone: {
      FreeFormNumber: string;
    };
    CompanyName: string;
    BillAddr: {
      Line1: string;
      City: string;
      Country: string;
      PostalCode: string;
    };
  }
  