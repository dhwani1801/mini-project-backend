import { RecordType, LogStatus } from "../enum/enum";

export interface LogData {
  qboId?: string;
  dbId? : string
  recordType?: RecordType;
  tenantID?: string;
  status?: LogStatus;
  message?: string;
  id?: string;
}
