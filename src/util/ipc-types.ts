/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quotes */

/**
 * Structured logs types. This is taken from Cloud.
 */

export enum StructuredLogLevel {
  Log = `LOG`,
  Warning = `WARNING`,
  Info = `INFO`,
  Success = `SUCCESS`,
  Error = `ERROR`,
  Debug = `DEBUG`,
}

export enum JobsApiNames {
  ImageProcessing = `IMAGE_PROCESSING`,
}

enum ActivityLogLevel {
  ActivitySuccess = `ACTIVITY_SUCCESS`,
  ActivityFailed = `ACTIVITY_FAILED`,
  ActivityInterrupted = `ACTIVITY_INTERRUPTED`,
}

export enum GlobalStatus {
  DataUpdateInProgress = `DATA_UPDATE_IN_PROGRESS`,
  NotStarted = `NOT_STARTED`,
  InProgress = `IN_PROGRESS`,
  Failed = `FAILED`,
  Success = `SUCCESS`,
  Interrupted = `INTERRUPTED`,
  Canceled = `CANCELED`,
  Uploading = `UPLOADING`,
  Downloading = `DOWNLOADING`,
}

export enum ActivityType {
  progress = `progress`,
  spinner = `spinner`,
  pending = `pending`,
  hidden = `hidden`,
}

export enum ActivityStatus {
  InProgress = `IN_PROGRESS`,
  NotStarted = `NOT_STARTED`,
  Failed = `FAILED`,
  Interrupted = `INTERRUPTED`,
  Success = `SUCCESS`,
}

export interface IncrementalBuildLogObject {
  deletedFiles?: string[]
  path?: string
  pages?: string[]
  [key: string]: any
}

interface BaseLogObject {
  /**
   * Log text content
   */
  text: string
  /**
   * Date string using `YYYY-MM-DDTHH:mm:ss.sssZ` format
   */
  timestamp: string

  /**
   * For stateful logs to keep track which service produced this log
   * (to know which logs to clear)
   */
  group?: string
}

export type GenericLogObject = BaseLogObject & {
  level: StructuredLogLevel
}

export type ActivityLogObject = BaseLogObject & {
  level: ActivityLogLevel
  /**
   * Any additional text meant to be displayed along main "text"
   * Can contain content like "10/10 1.23/s" (as meaningful result of running activity)
   */
  statusText?: string
  /**
   * Time from start to finish of activity in seconds
   */
  duration: number

  activity_uuid: string
  activity_type: string
  activity_current?: number
  activity_total?: number
}

interface Position {
  line: number
  column?: number
}

interface CallSite {
  fileName: string
  functionName?: string
  lineNumber?: number
  columnNumber?: number
}

export type ErrorLogObject = BaseLogObject & {
  level: StructuredLogLevel.Error
  /**
   * Error code. Not all errors will have codes, as not all of them have been converted yet.
   */
  code?: string
  /**
   * General classification of error. At time of writing it, this can be
   * one of `GRAPHQL`, `CONFIG`, `WEBPACK`, `PLUGIN`.
   */
  type?: string
  /**
   * Absolute path to file originating the error. Not all errors will have this field.
   */
  filePath?: string
  /**
   * Location of error inside file. Use to generated codeframes together with "filePath".
   * Not all errors will have this field
   */
  location?: {
    start: Position
    end?: Position
  }
  /**
   * Link to documentation about handling error ... or "https://gatsby.dev/issue-how-to"
   * for errors that don't have dedicated docs
   */
  docsUrl?: string

  /**
   * For now this is gatsby internals (it's used to generate "text", by pushing context through error text template).
   * In future this could be used to present dedicated error cards in web UIs.
   */
  context: Record<string, any>

  /**
   * Optional stack field (not all errors will have it)
   */
  stack?: CallSite[]
}

export type LogObject = ErrorLogObject | ActivityLogObject | GenericLogObject

export enum StructuredEventType {
  Log = `LOG`,
  Done = `DONE`,
  Ready = `READY`,
  Idle = `Idle`,
  BootstrapFinished = `BOOTSTRAP_FINISHED`,
  Success = `SUCCESS`,
  Failed = `FAILED`,
  Started = `STARTED`,
  StatefulLog = `STATEFUL_LOG`,
  SetStatus = `SET_STATUS`,
  SetLogs = `SET_LOGS`,
  ErrorLog = `ERROR_LOG`,
  ActivityStart = `ACTIVITY_START`,
  ActivityUpdate = `ACTIVITY_UPDATE`,
  ActivityEnd = `ACTIVITY_END`,
  ClearStatefulLog = `CLEAR_STATEFUL_LOG`,
  IncrementalBuild = `INC_BUILDS_ACTION`,
}

export interface StructuredEvent {
  timestamp: number
  payload: any
  type: StructuredEventType
}

export interface ActivityObject {
  /**
   * Identifier of action. It might be set to same thing as "text" if "id" wasn't explicitely provided.
   */
  id: string

  /**
   * Unique identifier of activity.
   */
  uuid: string
  /**
   * One of "progress", "spinner", "pending".
   * "pending" type activities are not meant to be displayed in UI, they are there
   * so gatsby internally can track if there is any more work to be done before going
   * into idle/error state from working state.
   */
  type: ActivityType
  /**
   * Text description of activity. (i.e. "source and transform nodes" or "building schema")
   */
  text: string
  /**
   * One of "IN_PROGRESS", "NOT_STARTED", "FAILED", "INTERRUPTED", "SUCCESS"
   * Only "IN_PROGRESS" should be displayed in UI, rest of statuses is for gatsby internals
   */
  status: ActivityStatus
  /**
   * Any additional text meant to be displayed along main "text"
   * Can contain content like "10/10 1.23/s" (as meaningful result of running activity)
   */
  statusText?: string

  /**
   * Time from start to finish of activity in seconds
   */
  duration?: number

  /**
   * Only in `"type": "progress"` - current tick
   */
  current?: number
  /**
   * Only in `"type": "progress"` - total ticks
   */
  total?: number
}

export interface ActivityUpdatePayload {
  id: string
  uuid: string
  text?: string
  status?: ActivityStatus
  type?: ActivityType
  startTime?: number[]
  statusText?: string
  current?: number
  total?: number
}

export interface ActivityEndPayload {
  id: string
  uuid: string
  status: ActivityStatus
  duration: number
}

export interface StateShape {
  messages: LogObject[]
  activities: Record<string, ActivityObject>
  statefulMessages: LogObject[]
  status: GlobalStatus
}

interface LogAction {
  type: StructuredEventType.Log
  payload: LogObject
}

export interface LogActionIncrementalBuilds {
  type:
    | "STARTED"
    | "DONE"
    | "READY"
    | "IDLE"
    | "BOOTSTRAP_FINISHED"
    | "SUCCESS"
    | "FAILED"
  payload?: IncrementalBuildLogObject
}

interface StatefulLogAction {
  type: StructuredEventType.StatefulLog
  payload: LogObject
}

interface StatefulLogClearAction {
  type: StructuredEventType.ClearStatefulLog
  payload: string
}

interface ActivityStartAction {
  type: StructuredEventType.ActivityStart
  payload: ActivityObject
}

interface ActivityUpdateAction {
  type: StructuredEventType.ActivityUpdate
  payload: ActivityUpdatePayload
}

interface ActivityEndAction {
  type: StructuredEventType.ActivityEnd
  payload: ActivityEndPayload
}

interface SetStatusAction {
  type: StructuredEventType.SetStatus
  payload: GlobalStatus
}

interface SetLogsAction {
  type: StructuredEventType.SetLogs
  payload: StateShape
}

export type Action =
  | LogAction
  | StatefulLogAction
  | StatefulLogClearAction
  | ActivityStartAction
  | ActivityUpdateAction
  | ActivityEndAction
  | SetStatusAction
  | SetLogsAction
  | LogActionIncrementalBuilds

interface IPCMessageVersion {
  type: `VERSION`
  gatsby: string
}

export enum IPCMessageType {
  LogAction = `LOG_ACTION`,
  IncBuildsAction = `INC_BUILDS_ACTION`,
  JobCreatedAction = `JOB_CREATED`,
  JobCompletedAction = `JOB_COMPLETED`,
  JobFailedAction = `JOB_FAILED`,
  JobNotWhiteListed = `JOB_NOT_WHITELISTED`,
}

export interface IPCMessageLog {
  type: IPCMessageType.LogAction | IPCMessageType.IncBuildsAction
  action: Action
  /**
   * Date string using `YYYY-MM-DDTHH:mm:ss.sssZ` format
   */
  timestamp: string
}

export interface IPCJobMessage {
  type: IPCMessageType.JobCreatedAction
  payload: {
    id: string
    name: string
    inputPaths: {
      path: string
      contentDigest: string
    }[]
    outputDir: string
    contentDigest: string
    args: Record<string, any>
    plugin: {
      name: string
      version: string
    }
  }
}

export type IPCMessage = IPCMessageVersion | IPCMessageLog | IPCJobMessage
/* eslint-enable quotes */
