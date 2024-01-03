export interface InvoiceObject {
  Line: [
    {
      DetailType: string;
      Amount: number;
      SalesItemLineDetail: {
        ItemRef: {
          name: string;
          value: string;
        };
      };
    }
  ];
  CustomerRef: {
    value: string;
  };
}
