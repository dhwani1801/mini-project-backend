import { RecordType, LogStatus } from "../enum/enum";

export interface LogData {
  qboId?: string;
  recordType?: RecordType;
  tenantID?: string;
  status?: LogStatus;
  message?: string;
  id?: string;
}
