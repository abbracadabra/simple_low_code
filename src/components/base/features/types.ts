export type EnabledOrDisabled = {
    enabled?: boolean
  }

  export type OpeningStatement = EnabledOrDisabled & {
    opening_statement?: string
    suggested_questions?: string[]
  }
  

//   export type FileUpload = {
//     image?: EnabledOrDisabled & {
//       detail?: Resolution
//       number_limits?: number
//       transfer_methods?: TransferMethod[]
//     }
//     allowed_file_types?: string[]
//     allowed_file_extensions?: string[]
//     allowed_file_upload_methods?: TransferMethod[]
//     number_limits?: number
//     fileUploadConfig?: FileUploadConfigResponse
//   } & EnabledOrDisabled
  

export enum FeatureEnum {
    moreLikeThis = 'moreLikeThis',
    opening = 'opening',
    suggested = 'suggested',
    text2speech = 'text2speech',
    speech2text = 'speech2text',
    citation = 'citation',
    moderation = 'moderation',
    file = 'file',
    annotationReply = 'annotationReply',
  }
  
  export type Features = {
    // [FeatureEnum.moreLikeThis]?: MoreLikeThis
    [FeatureEnum.opening]?: OpeningStatement
    // [FeatureEnum.suggested]?: SuggestedQuestionsAfterAnswer
    // [FeatureEnum.text2speech]?: TextToSpeech
    // [FeatureEnum.speech2text]?: SpeechToText
    // [FeatureEnum.citation]?: RetrieverResource
    // [FeatureEnum.moderation]?: SensitiveWordAvoidance
    // [FeatureEnum.file]?: FileUpload
    // [FeatureEnum.annotationReply]?: AnnotationReplyConfig
  }
  