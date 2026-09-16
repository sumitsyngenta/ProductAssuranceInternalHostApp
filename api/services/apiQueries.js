import { gql } from '@apollo/client';



export const  StatusCodes = {
   SR200: 'SR200',
   MH409: 'MH409', //Force Update
   SR410: 'SR410', //Already Logged in Another Device
   SR412: 'SR412', //Multi Login or Subordinate InActive or Delete
   SR413: 'SR413', //shipper/carton scan by using display box section
   SR414: 'SR414',
   SR402: 'SR402', //Subordinate Inactive by Retailer at T&C
   SR407: 'SR407', //Restricted after the Invalid Attemps
   SR415: 'SR415', //Login restriction if kyc incomplete
   SR404: 'SR404', //Tier data not available for division
   SR409: 'SR409', //Duplicate Scan occured (Already received points)
   SR401: 'SR401', //Access Denied, logout user once received.
   SR411: 'SR411', //Retailer capping limit reached
   SR428: 'SR428', //Redeem points criteria not met
   SR451: 'SR451', //Redemption already in progress
   SR503: 'SR503' //Tiering coming soon
}


export const responseMessages = {
   ACCESS_DENIED: 'Access is denied',
}

export const SEND_OTP_MSGBIRD = gql`
   mutation v3sendOtp(
      $phoneNumber: Long!,
      $otpTyp: OtpType!,
      $countryCode: String!,
      $identifier:String,
      $languageId: Int!,
      $deviceId: String,
      $proceedToLogin: Boolean
   ) {
      v3sendOtp(sendOtpRequest: {
            phoneNumber: $phoneNumber
            otpType: $otpTyp
            countryCode: $countryCode
            identifier: $identifier
            proceedToLogin: $proceedToLogin
            deviceId: $deviceId
            languageId:$languageId
         }
      ) {
         code
         message
         resData{
             id,
             href
             recipient
             originator
             type
             reference
             status
             messages : messages {
                 id
                 href
             }
             createdDatetime
             validUntilDatetime
             otpLength
             otpExpiresIn
             loginBlockedTill
         }
   }
}
`;

export const VALIDATE_OTP_MSGBIRD = gql`
   mutation v3validateOtp (
      $phoneNumber: Long!,
      $otp: String!,
      $languageId: Int!,
      $countryCode: String!,
      $smsId: String!
   ) {
      v3validateOtp(
         validateOtpRequest: {
            phoneNumber : $phoneNumber
            countryCode: $countryCode
            languageId: $languageId
            otp: $otp
            smsId: $smsId
         }
      ) {
         code
         message
         resData {
            accessToken
            firstTimeLogin
            termsAndConditionsPath
            termsUpdatedTime
            user {
               buId
               retailerName
               pragatiWebUrl
               name
               id
               tcAgreed
               shopName
               mobileNumber
               taluka
               district
               state {
                  country {
                     createdDate
                     id
                     mobileCode
                     name
                     phMaxLength
                     status
                     updatedDate
                  }
                  createdDate
                  id
                  name
                  status
                  updatedDate
                  isEnableScan
                  productsEligibleToScan
               }
               pincode
               userType
               imageUrl
               lastLoginTime
               parentUserId
            }
            recentMilestoneInfo {
               name
               points
               scanCount
               type
            }
            pointsInfo {
               bonusPoints
               redeemPoints
               scanPoints
            }
            subOrdinatesList {
               id
               mobileNumber
               name
               retailerUserId
               status
               userType
            }
            kycStatus {
               id
               fullName
               name
               kycStatus
               kycDate
            }
            enableMultipleBU
         }
      }
   }
`;

export const TRANSLATIONS_LIST = gql`
   query languageTranslationV2($languageId: Int!, $userId: Int, $buId: Int) {
      languageTranslationV2(languageId: $languageId, userId: $userId, buId: $buId) {
         code
         resData {
            translations
            languageTutorials {
               buId
               iconUrl
               key
            }
         }
         message
      }
   }
`;

export const LANGUAGE_LIST_QUERY = gql`
   query {
      language {
         code
         message
         resData {
            languageList {
               id
               name
               code
               isActive
               proceedText
               languageTitleText
            }
         }
      }
   }
`;


export const TERMS_AND_CONDITIONS = gql`
   query acceptTermsAndCondition($userId: Int!, $languageId: Int) {
      acceptTermsAndCondition(userId: $userId, languageId: $languageId) {
         code
         message
         resData {
            accessToken
            firstTimeLogin
            termsAndConditionsPath
            termsUpdatedTime
            user {
               buId
               retailerName
               pragatiWebUrl
               name
               id
               tcAgreed
               shopName
               mobileNumber
               taluka
               district
               state {
                  country {
                     createdDate
                     id
                     mobileCode
                     name
                     phMaxLength
                     status
                     updatedDate
                  }
                  createdDate
                  id
                  name
                  status
                  updatedDate
                  isEnableScan
               }
               pincode
               userType
               parentUserId
            }
            recentMilestoneInfo {
               scanCount
               name
               points
               type
            }
            pointsInfo {
               bonusPoints
               redeemPoints
               scanPoints
            }
         }
      }
   }
`;

export const FREQUENT_SYNC_DATA = gql`
   query getSyncDataV8($userId: Int!, $countryId: Int!, $languageId: Int, $buId: Int) {
      getSyncDataV8(
         userId: $userId
         countryId: $countryId
         languageId: $languageId
         buId: $buId
      ) {
         code
         message
         resData {
            viewedScanHistory
            viewedScanPoints
            cappingEnabled
            retailerCappingReached
            user {
              id
              name
              mobileNumber
              shopName
              taluka
              district
              state {
                id
                name
                status
                isEnableScan
                productsEligibleToScan
              }
              country
              countryId
              pincode
              userType
              parentUserId
              status
              lastLoginTime
              imageUrl
              tcAgreed
              pragatiWebUrl
              toolTipLink
              retailerName
              buId
              isDistributorRetailer
            }
            subOrdinatesList {
              id
              name
              mobileNumber
              userType
              retailerUserId
              status
              retailerName
              retailerMobileNumber
              buId
            }
            results {
            scanPointList {
               date
               scanResults {
                  id
                  brand
                  earnedPoints
                  productName
                  productId
                  retailerUserId
                  subOrdinateId
                  quantity
                  isReversal
                  scanDateTime
                  scanMessage
                  scanStatus
                  scanLevel
                  journeyType
                  unitSerialNumber
                  shipperSerialNumber
                  grandParentSerialNumber 
                  isGrandParentScan @client
               }
            }
            totalCount
            totalPoints
            totalLoyaltyPoints
         }
            termsUpdatedTime
            termsAndConditionsPath
            yearSummary{
               year
               achievedValue
               priceMetric
               loyaltyPoints
               tierId
               tier
               sortOrder
           }
      }
   }
}
`;

export const SUBMIT_SCAN_V9 = gql`
   mutation v9submitScan(
      $retailerUserId: Int
      $subOrdinateUserId: Int
      $scanSubmitType: ScanSubmitType!
      $businessUnitId: Int
      $feCreatedTime : Date
      $scanShipperOrUnitRequests: [ScanShipperOrUnitRequestV2Input]
      $languageId: Int
      $appVersion: String
      $cappingEnabled: Boolean
   ) {
      v9submitScan(
         scanSubmitRequest: {
            retailerUserId: $retailerUserId
            subOrdinateUserId: $subOrdinateUserId
            scanSubmitType: $scanSubmitType
            businessUnitId: $businessUnitId
            scanShipperOrUnitRequests: $scanShipperOrUnitRequests
            feCreatedTime : $feCreatedTime
            languageId: $languageId
            appVersion: $appVersion
            cappingEnabled: $cappingEnabled
         }
      ) {
         code
         message
         resData {
            scanSubmittedId
            successfulScans
            totalEarnedPoints
            totalScanSubmitted
            scanMessage
         }
      }
   }
`;

export const SUBMIT_V9_SCAN = gql`
   mutation v9submitScan(
      $retailerUserId: Int
      $subOrdinateUserId: Int
      $scanSubmitType: ScanSubmitType!
      $businessUnitId: Int
      $feCreatedTime : Date
      $scanShipperOrUnitRequests: [ScanShipperOrUnitRequestV2Input]
      $languageId: Int
      $unitScanLimit: Int
      $shipperScanLimit: Int    
   ) {
      v9submitScan(
         scanSubmitRequest: {
            retailerUserId: $retailerUserId
            subOrdinateUserId: $subOrdinateUserId
            scanSubmitType: $scanSubmitType
            businessUnitId: $businessUnitId
            scanShipperOrUnitRequests: $scanShipperOrUnitRequests
            feCreatedTime : $feCreatedTime
            languageId: $languageId
            unitScanLimit: $unitScanLimit
            shipperScanLimit: $shipperScanLimit
         }
      ) {
         code
         message
         resData {
         scanSubmittedId
            successfulScans
            totalEarnedPoints
            totalScanSubmitted
            scanMessage
         }
      }
   }
`;

export const GET_TM_MDO_DETAILS = gql`
   query getTMAndMDODetailsV2(
      $buId: Int
      $userId: Int
   ) {
      getTMAndMDODetailsV2(
            buId: $buId
            userId: $userId
      ) {
         code
         message
         resData {
            data{
                hierarchyName
                name
                phoneNumber
                portfolio
            }
         }
      }
   }
`;

export const DEVICE_TOKEN = gql`
   mutation deviceToken(
      $deviceType: DeviceType!
      $userId: Int
      $deviceToken: String!
      $deviceId: String
   ) {
      deviceToken(
         deviceToken: {
            deviceType: $deviceType
            userId: $userId
            deviceToken: $deviceToken
            deviceId: $deviceId
         }
      ) {
         code
         message
         resData
      }
   }
`;
export const SAVE_SUBORDINATE = gql`
   mutation saveSubOrdinateV2(
      $retailerUserId: Int!
      $phoneNumber: Long!
      $countryCode: String!
      $name: String!
   ) {
      saveSubOrdinateV2(
         retailerUserId: $retailerUserId
         phoneNumber: $phoneNumber
         countryCode: $countryCode
         name: $name
      ) {
         code
         resData {
            id
            language {
               code
               createdDate
               id
               name
               nameEn
               status
               updatedDate
            }
            mobileNumber
            name
            retailerUserId
            status
            userType
         }
         message
      }
   }
`;

export const UPDATE_SUBORDINATE = gql`
   mutation updateSubOrdinate(
      $retailerUserId: Int!
      $phoneNumber: Long!
      $countryCode: String!
      $name: String!
      $subOrdinateUserId: Int!
   ) {
      updateSubOrdinate(
         retailerUserId: $retailerUserId
         phoneNumber: $phoneNumber
         countryCode: $countryCode
         name: $name
         subOrdinateUserId: $subOrdinateUserId
      ) {
         code
         resData {
            id
            language {
               code
               createdDate
               id
               name
               nameEn
               status
               updatedDate
            }
            mobileNumber
            name
            retailerUserId
            status
            userType
         }
         message
      }
   }
`;

export const UPDATE_SUBORDINATE_STATUS = gql`
   mutation updateSubOrdinateStatus(
      $retailerUserId: Int!
      $subOrdinateUserId: Int!
      $status: Status!
   ) {
      updateSubOrdinateStatus(
         retailerUserId: $retailerUserId
         subOrdinateUserId: $subOrdinateUserId
         status: $status
      ) {
         code
         resData {
            id
            language {
               code
               createdDate
               id
               name
               nameEn
               status
               updatedDate
            }
            mobileNumber
            name
            retailerUserId
            status
            userType
         }
         message
      }
   }
`;

export const SAVE_CREATE_BGP = gql`
   mutation createBGPV2($bu: Int!
      $mobileNumber: Long!
      $businessGrowthPlan: BusinessGrowthPlanRequestInput
      $businessGrowthPlanStatus: String!
   ){
     createBGPV2(userBGPRequest:{ bu: $bu
      mobileNumber: $mobileNumber
      businessGrowthPlan: $businessGrowthPlan
      businessGrowthPlanStatus: $businessGrowthPlanStatus
     }
      ) {
      code
      message
      resData
   }
}
`;

export const UPDATE_BGP_STATUS = gql`
   mutation updateBGPStatus(
         $userId: Long!
         $status: BusinessGrowthPlanStatus
         ) {
            updateBGPStatus(
               userId: $userId,
               status: $status
            )
         {
             code
             message
      }
}
`;

export const GET_BGP_PORTFOLIO_BRAND = gql`
   query getPortfolioBrands($buId: Int!,
   $stateId:Int!,
   $userId:Int!,
   $languageId: Int!) {
   getPortfolioBrands(
      buId: $buId,
      stateId: $stateId,
      userId: $userId,
      languageId: $languageId
      ) {
         code
         message
         resData{
               portfolios{
                  name
                  portfolioId
                  brands{
                     brandName
                     brandId
                     targetValue
                     targetVolume
                     achievedValue
                     achievedVolume
                     completionPercentage
                     unitVolumePrice
                     subBu
               }
            }
         }
      }
   }
`;


export const GET_BGP = gql`
query getbgp($retailerUserId: Int!, $languageId: Int!, $buId: [Int]!, $subBuList: [Int]!){
   getBgp(retailerUserId: $retailerUserId, languageId: $languageId, buId: $buId, subBuList: $subBuList){
     code
     message
     resData{
       bgp{
         completionPercentage
         retailerName
         retailerUserId
         totalAchievedValue
         totalTargetValue
         bgpStatus
         brands{
           brandId
           brandName
           achievedValue
           achievedVolume
           completionPercentage
           liquidationPercentage
           targetValue
           targetVolume
           unitVolumePrice
           isTmModified
           subBu
         }
       }
   }
   }
 }
`
export const UPDATE_BGP = gql`
   mutation updateBGPV2(
      $bu: Int!
      $mobileNumber: Long!
      $businessGrowthPlan: BusinessGrowthPlanRequestInput
      $businessGrowthPlanStatus: String!
   ){
      updateBGPV2(userBusinessGrowthPlanDto:{
         bu: $bu
         mobileNumber: $mobileNumber
         businessGrowthPlan: $businessGrowthPlan
         businessGrowthPlanStatus: $businessGrowthPlanStatus
     }
      ) {
      code
      message
   }
}
`;

export const SCAN_RESULT_QUERY = gql`
   query v8scanSubmitResult($scanSubmitId: String!, $userId: Int!, $languageId: Int!, $buId:Int!) {
      v8scanSubmitResult(scanSubmitId: $scanSubmitId, userId: $userId, languageId: $languageId, buId:$buId) {
         code
         message
         resData {
            scanResults {
               id
               brand
               earnedPoints
               productName
               productId
               retailerUserId
               subOrdinateId
               quantity
               isReversal
               scanDateTime
               scanMessage
               scanStatus
               scanLevel
               journeyType
               unitSerialNumber
               shipperSerialNumber
               grandParentSerialNumber
               isGrandParentScan @client
            }
            totalCount
            totalPoints
         }
      }
   }
`;

export const GET_USER_LOYALTY_POINTS = gql`
  query v3UserLoyaltyPointsResult($userId: Int!, $buId: Int!) {
    v3UserLoyaltyPointsResult(userId: $userId, buId: $buId) {
      code
      message
      resData {
        totalScanPoints
        totalBonusPoints
        totalEarnedPoints
        totalRedeemedPoints
        totalAvailablePoints
        totalReservedPoints
        totalRedeemablePoints
        isViewedScanHistory
        isViewedScanPoints
        totalUnReadNotifications
      }
    }
  }
`;

export const GET_MILESTONE_BONUS_POINTS = gql`
   query getBonusPointsByMilestone(
      $userId: Int!,
      $buId: Int!,
      $yayReadStatus: Boolean,
      $pageNo: Int,
      $pageSize: Int,
      $languageId: Int!,
   ) {
      getBonusPointsByMilestone(
         userId: $userId,
         buId: $buId,
         yayReadStatus: $yayReadStatus,
         pageNo: $pageNo,
         pageSize: $pageSize
         languageId: $languageId) {
         resData {
            pageDto{
               pageNo
               pageSize
               totalCount
            }
            milestoneBonusPoints {
               bonusPoints
               type
               scanCount
               createdDate
               mileStoneValue
               year
               name
               message
            }
            totalBonusPoints
         }
         code
         message
      }
   }
`;
export const GET_USER_SCAN_POINTS = gql`
   query v3UserScanPointResults(
      $userId: Int!
      $direction: DirectionType!
      $from: String
      $to: String
      $pageNo: Int
      $pageSize: Int
      $productId: [Int]
      $subOrdinateId: [Int]
      $scanStatus: [ScanStatus]
      $languageId: Int
      $buId: Int
      $isSerialNumberViewed:Boolean
      $isCompletedScan:Boolean
   ) {
      v3UserScanPointResults(
         userId: $userId
         direction: $direction
         from: $from
         to: $to
         pageNo: $pageNo
         pageSize: $pageSize
         productId: $productId
         subOrdinateId: $subOrdinateId
         scanStatus: $scanStatus
         languageId: $languageId
         buId: $buId
         isSerialNumberViewed: $isSerialNumberViewed
         isCompletedScan: $isCompletedScan
      ) {
         code
         message
         resData {
            scanResults {
               id
               brand
               earnedPoints
               isReversal
               productName
               productId
               retailerUserId
               subOrdinateId
               quantity
               scanDateTime
               scanMessage
               scanStatus
               scanLevel
               journeyType
               unitSerialNumber
               shipperSerialNumber
               grandParentSerialNumber
               isGrandParentScan @client
            }
            totalPoints
            totalCount
         }
      }
   }
`;

export const GET_NOTIFICATIONS = gql`
   query v3getNotification(
      $userId: Int!
      $isRead: Boolean
      $pageNo: Int
      $pageSize: Int
      $buId: Int
   ) {
      v3getNotification(
         userId: $userId
         isRead: $isRead
         pageNo: $pageNo
         pageSize: $pageSize
         buId : $buId
      ) {
         code
         message
         resData {
            notificationDto {
               id
               title
               description
               isRead
               notificationCategory
               notificationType
               createdDate
               data
               dataType
               youtubeImgLink
               attachmentUrl
               attachmentExtension
            }
            totalCount
         }
      }
   }
`;

export const UPDATE_READ_STATUS_NOTIFICATIONS = gql`
   mutation v2updateReadStatus($userId: Int!, $notificationId: String!, $buId: Int) {
      v2updateReadStatus(userId: $userId, notificationId: $notificationId, buId : $buId) {
         code
         message
         resData
      }
   }
`;

export const LOGOUT = gql`
   query logout($refreshToken: String!, $userId: Int!) {
      logout(refreshToken: $refreshToken, userId: $userId) {
         code
         message
      }
   }
`;

export const UPDATE_LOGIN_STATUS = gql`
  mutation updateLoginStatus($userId: Int!, $status: Boolean!, $buId: Int!) {
    updateLoginStatus(userId: $userId, status: $status, buId: $buId) {
      code
      message
      resData
    }
  }
`;

export const REMOVE_PHOTO = gql`
mutation deleteProfileImage($userId: Int!) {
   deleteProfileImage(userId: $userId) {
      code
      message
   }
}
`;


export const SUBMIT_AUTO_SAVE_DETETED_SCAN = gql`
   mutation v2removeAutoScan(
      $sapScanList: [ScanShipperOrUnitRequestInput]
      $autoSaveRequest: Boolean!
      $retailerUserId: Int
      $subOrdinateId: Int
      $userId: Int
   ) {
      v2removeAutoScan(
         scanLimitRequest: {
            sapScanList: $sapScanList
            autoSaveRequest: $autoSaveRequest
            retailerUserId: $retailerUserId
            subOrdinateId: $subOrdinateId
            userId: $userId
         }
      ) {
         code
         message
      }
   }
`;

export const GET_USER_SCAN_HISTORY = gql`
   query v3UserScanHistoryResults(
      $userId: Int!
      $from:String
      $to:String
      $direction: DirectionType!
      $pageNo: Int
      $pageSize: Int
      $productId: [Int]
      $subOrdinateId: [Int]
      $scanStatus: [ScanStatus]
      $languageId: Int
      $buId: Int
      $isSerialNumberViewed:Boolean
   ) {
      v3UserScanHistoryResults(
         userId: $userId
         from: $from
         to: $to
         direction: $direction
         pageNo: $pageNo
         pageSize: $pageSize
         productId: $productId
         subOrdinateId: $subOrdinateId
         scanStatus: $scanStatus
         languageId: $languageId
         buId: $buId
         isSerialNumberViewed: $isSerialNumberViewed
      ) {
         code
         message
         resData {
            totalCount
            totalPoints
            previousDate
            nextDate
            scanPointList {
               date
               scanResults {
                  id
                  brand
                  earnedPoints
                  isReversal
                  productName
                  productId
                  retailerUserId
                  subOrdinateId
                  quantity
                  scanDateTime
                  scanMessage
                  scanStatus
                  scanLevel
                  journeyType
                  unitSerialNumber
                  shipperSerialNumber
                  grandParentSerialNumber
                  isGrandParentScan @client
               }
            }
         }
      }
   }
`;

export const GET_BONUS_READ_STATUS = gql`
   query v2bonusPointReadStatus($userId: Int, $buId: Int, $languageId: Int) {
      v2bonusPointReadStatus(userId: $userId, buId: $buId, languageId: $languageId) {
         code
         message
         resData {
            isBonusPointsRead
            recentMilestoneInfo {
               isYayRead
               scanCount
               name
               points
               type
            }
            userBannerDto {
               bannerConfList {
                  buId
                  displaySec
                  id
                  imageUrl
                  hyperlinkUrl
                  hyperlinkType
                  isDefault
                  name
               }
               userType
            }
         }
      }
   }
`;

export const GET_USER_BANNERS_V3 = gql`
   query getUserBannersV3($userId: Int!, $buId: Int!, $languageId: Int!) {
      getUserBannersV3(userId: $userId, buId: $buId, languageId: $languageId) {
         code
         message
         resData {
            bannerConfList {
               buId
               displaySec
               id
               imageUrl
               hyperlinkUrl
               hyperlinkType
               isDefault
               name
            }
         }
      }
   }
`;

export const SCANNED_PRODUCT_LIST = gql`
   query v4products($userType: UserType!, $userId: Int!, $isSuccess: Boolean, $buId: Int) {
      v4products(userType: $userType, userId: $userId, isSuccess: $isSuccess, buId: $buId) {
         code
         message
         resData {
            productList {
               id
               name
               brand
               buId {
                  fullName
                  id
                  sakshamBuId
               }
            }
         }
      }
   }
`;

export const GET_PORTFOLIO_DATA = gql`
query getPortfolios($userId:Int!, $pageNo : Int, $pageSize : Int, $buId:[Int],$stateId : Int,$languageId : Int){
   getPortfolios(userId:$userId, pageNo : $pageNo, pageSize : $pageSize, buId:$buId,stateId:$stateId,languageId : $languageId){
     code
     message
     resData{
       brandPortfolioDtoList{
         id
         portfolioName
         imageId
         imageURL
         buId{
           id
           name
           sakshamBuId
           fullName
           displayOrder
         }
         isDeleted
         createdBy
         stateIds
       }
     }
   }
 }
`;


export const GET_BRANDS_LIST = gql`
   query getMasterBrands($userId:Int!, $portfolioId : Int, $pageNo : Int, $pageSize : Int,$languageId : Int,$stateId : Int, $buIds:[Int]){
      getMasterBrands(userId:$userId, portfolioId : $portfolioId, pageNo : $pageNo, pageSize : $pageSize,languageId : $languageId,stateId : $stateId, buIds:$buIds){
        code
        message
        resData{
          brands{
            id
            name
            description
            portfolio{
              id
              portfolioName
            }
            imageUrl
            imagePath
            pdfPath
            pdfURL
            pdfName
            stateList{
              id
              name
            }
            createdTime
            cropList{
               id
               cropsDto{
                 id
                 cropName
               }
               imageId
               imageURL
               imageName
               pdfId
               pdfURL
               pdfName
               languageId
             }
          }
        }
      }
    }
`;

export const READ_ALL_NOTIFICATIONS = gql`
   mutation v2readAllNotification(
      $userId: Int,
      $buId: Int
   ) {
      v2readAllNotification(
            userId: $userId,
            buId : $buId
      ) {
         code
         message
         resData
      }
   }
`;

export const BU_RIGESTRATION_POINTS = gql`
query getFirstLoginBounsPoints($userId:Int!, $userType: String!, $buId: Int) { 
   getFirstLoginBounsPoints(userId:$userId, userType: $userType, buId: $buId) {
      code
      message
      resData {
      tutorialConfig {
         homeTutorialLimit
         scanTutorialLimit
      }
      firstTimeLogin
         recentMilestoneInfo {
            milestone{
               name
               points
               type
            }
         }
     }
   }
}
`;

export const GET_UNREAD_NOTIFICATIONS_COUNT = gql`
query unReadNotificationCount($userId: Int!, $buId: Int! ){
       unReadNotificationCount(userId: $userId,buId: $buId){
            code
            message
            resData
         }
      }
`;

export const GET_SYNC_CONFIG_DATA = gql`
query getConfigSyncDataV2($userId: Int!, $countryId: Int!, $languageId: Int, $buId: Int) {
   getConfigSyncDataV2(userId: $userId countryId: $countryId languageId: $languageId buId: $buId) {
      code
      message
      resData {
         myPerformanceConfig
         knowYourTMMDOConfig
         brandCommunicationConfig
         productAssuranceConfig
         scanConfig
         allowedDomains
         tierConfig
         aboutProgramConfig
         pointsCatalogueConfig
         faqConfig
         luckyDrawConfig
         redemptionConfig
         queryModuleConfig
         productCatalogueConfig
         b2bConfig
         schemesConfig
         bannerConfList {
            buId
            displaySec
            id
            imageUrl
            hyperlinkUrl
            hyperlinkType
            isDefault
            name
         }
         tutorialConfig {
            homeTutorialLimit
            scanTutorialLimit
         }
         supportContactDetailsDto {
            id
            contactNumber
            emergencyContactNumber
            emailId
            address
            buLevel
         }
         bgpConfigDto{
               bgpStatusDto{
				         status
				         subBu
				      }
               year
               enabled
            completionPercentage
            }
         kycStatus {
            id
            name
            fullName
            kycStatus
            kycDate
         }
         scanHistoryConf {
            type
            lastVisibleDays
         }
         scanLimitConf {
            type
            limit
            message
            isEnabled
         }
         subordinateConf {
            type
            maxLimit
         }
         brandSkuList {
            buId {
               name
               sakshamBuId
               fullName
               id
            }
            brand
            brandType
            company
            id
            name
            gtinGrandParent
            scanLevel
            productPointsDto {
               gtin
               points
               quantity
               type
            }
            unitWeight
         }
      }
   }
}
`;

export const GET_USER_TIER_DETAILS = gql`
query userTierDetailsV2($buId: Int!, $userId: Int!) {
   userTierDetailsV2(buId: $buId, userId: $userId) {
      code
      message
      resData{
         userId
         tiers{
         id
         name
         sortOrder
         accomplished
         calculationMetric
         rewardMetric
         rewardValue
         startValue
         endValue
         }
         currentYearSummary{
            achievedValue
            tier
            tierId
            year
            calculationMetric
            sortOrder
         }
         previousYearSummary{
            achievedValue
            tier
            tierId
            year
            calculationMetric
            sortOrder
         }
         upgradeTier{
         calculationMetric
         id
         name
         valueToAchieve
         sortOrder
         }
      }
   }
}
`;

export const GET_SCAN_POINTS_CATALOGUE_INFO = gql`
   query getScanPointCatalogue($buId: Int!, $userId:Int!) {
   getScanPointCatalogue(
      buId: $buId,
      userId: $userId,
      ) {
            code
            message
            resData {
               brandList {
                  brandId
                  brandName
                  brandSkuList {
                     brandSkuName
                     shipperPoints
                     unitPoints
                  }
               }
               pdfFileLink
            }
         }
      }
`;

export const GET_PRODUCT_CATALOGUE_INFO = gql`
   query getProductCatalogue($languageId: Int, $searchBy: String, $buId: Int, $userId: Int) {
      getProductCatalogue(languageId: $languageId, searchBy: $searchBy, buId: $buId, userId: $userId) {
         code
         message
         resData {
            catalogues {
               cropName
               description
               pdfFileName
               cropImageUrl
               pdfFileUrl
            }
         }
      }
   }
`;

export const GET_BASE64_FOR_PDF_GENERATION = gql`
   query createPDFForScanPointCatalogue($buId: Int!, $userId:Int!) {
     createPDFForScanPointCatalogue(buId: $buId,userId: $userId) {
         code
         message
         resData {
            byteArray
         }
      }
   }
`;

export const GET_ABOUT_THE_PROGRAM = gql`
query getPrograms($languageId: Int!) {
   getPrograms(languageId:$languageId) {
      code
      message
      resData {
         programs {
            id
            categoryName
            icon
            content
            displayOrder
         }
         hyperTextMapping {
            key
            redirectScreenName
         }
         pdfDetails {
            pdfTitle
            pdfSize
            pdfLink
         }
      }
   }
}
`;

export const GET_USER_FAQ_INFO = gql`
query getUserFaqDetails($userId: Int!, $languageId: Int, $buId: Int){
   getUserFaqDetails(userId: $userId, languageId: $languageId, buId: $buId) {
      code
      message
      resData {
         categories {
            id
            name
            displayOrder
          }
         faqs {
            id
            question
            answer
            displayOrder
            categoryId
         }
      }
   }
}
`;

export const GET_REDEEMED_POINTS_RESULTS = gql`
query getRedeemedPointsResult($retailerUserId: Int!, $buId: Int!) {
   getRedeemedPointsResult(retailerUserId: $retailerUserId, buId: $buId) {
      code
      message
      resData {
         retailerUserId
         totalRedeemedPoints
         redeemedPointsInfo {
            points
            description
            redeemedDate
         }
      }
   }
}
`;

export const GET_PREVIOUS_YEAR_BGPS = gql`
query getPreviousYearBgps($userId: Int!, $buId: Int!) {
   getPreviousYearBgps(userId: $userId, buId: $buId) {
      code
      message
      resData {
         userId
         bgpDetails {
            year
            plannedValue
            actualValue
            completionPercentage
         }
      }
   }
}
`;

export const GET_MY_PERFORMANCE_PREVIOUS_YEAR = gql`
  query getMyPerformancePreviousYearBgps($userId: Int!, $buId: Int!) {
    getMyPerformancePreviousYearBgps(userId: $userId, buId: $buId) {
      code
      message
      resData {
        userId
        bgpDetails {
          year
          plannedValue
          actualValue
          completionPercentage
          brandScanned
        }
      }
    }
  }
`;

export const GET_MY_PERFORMANCE_CURRENT_YEAR = gql`
  query getMyPerformanceCurrentYearDetails($userId: Int!, $buId: Int!) {
    getMyPerformanceCurrentYearDetails(userId: $userId, buId: $buId) {
      code
      message
      resData {
        userId
        targetValue
        actualValue
        achievedPercentage
        yojnaBrands
        yojnaAchievedValue
        otherBrands
        othersAchievedValue
        brandsDtoList {
          achievedVolume
          targetVolume
          brandName
          liquidationPercentage
        }
      }
    }
  }
`

export const GET_NET_INFO = gql`
   query GetNetInfo {
      netInfo @client
   }
`;