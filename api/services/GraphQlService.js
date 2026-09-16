import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, gql, HttpLink } from '@apollo/client';
import { GET_BONUS_READ_STATUS, GET_NET_INFO, StatusCodes, responseMessages } from '../services/apiQueries';

export const GET_AUTH = gql`
   query GetAuth {
      isLoggedIn @client
      token @client
   }
`;
export const cache = new InMemoryCache();

class GraphQlService {
   httpLink = new HttpLink({
      uri: '',
   });
   middlewareLink = new ApolloLink((operation, forward) => {
      const token = 'Bearer ';
      operation.setContext({
         headers: {
            Authorization: token,
         },
      });
      return forward(operation);
   });
   link = this.middlewareLink.concat(this.httpLink);

   apolloClient = new ApolloClient({
      link: this.httpLink,
      cache: cache,
   });

   makeMutationRequest = (data) => {
      console.log('GraphQL Mutation Request Data:', data);
      this.uri = 'https://uat.gpd-india.syngentadigitalapps.com/graphql';
      this.headers = {
         'x-sr-version': '1.3.9',
         'x-sr-platform-type': 'ANDROID',
      };
      return this.apolloClient
         .mutate({
            mutation: data.query,
            variables: data.variables,
            context: {
               uri: this.uri,
               headers: JSON.parse(JSON.stringify(this.headers)),
            },
         })
         .then((res) => {
      console.log('Making GraphQL request with URI:', data);
            return res;
         })
         .catch((err) => {
            const isTokenExpiredOrAccessDenied =
               err?.networkError?.result?.status === StatusCodes.SR401 ||
               err.message?.toLowerCase().includes(responseMessages.ACCESS_DENIED);
            if (err?.networkError?.result?.code === StatusCodes.SR412) {
               console.log('Force update required');
            } else if (err?.networkError?.result?.status === StatusCodes.SR409) {
               console.log('Conflict error - possible duplicate entry or version mismatch');
            } else if (isTokenExpiredOrAccessDenied) {
               console.log('Token expired or access denied. Clearing auth data.');
            } else if (err?.message === 'Network request failed') {
               
            }
            console.error('GraphQL request error:', JSON.stringify(err));
            return err;
         })
         .finally(() => {
         });
   };

}
export const graphQlService = new GraphQlService();






//   graphQlService
//                     .makeMutationRequest({
//                         query: SEND_OTP_MSGBIRD,
//                         microService: MicroService.UserService,
//                         variables: {
//                             phoneNumber: mobileNumber.toString(),
//                             countryCode: selectedCountry?.mobileCode,
//                             otpTyp: OtpType.SEND,
//                             identifier: (hashKey && isAndroid) ? hashKey : '',
//                             proceedToLogin: !!_proceedToLogin,
//                             deviceId: uniqueId ?? "",
//                             languageId: 1,
//                         },
//                     })
//                     .then((res) => {
//                         const response = res?.data?.v3sendOtp;
//                         if (response != null) {
//                             setErrorMessage('');
//                             if (response?.code === StatusCodes.SR200) {
//                                 navigation.navigate(OTP_SCREEN, {
//                                     phoneNumber: mobileNumber,
//                                     otpExpiresIn: response?.resData?.otpExpiresIn,
//                                     otpLength: response?.resData?.otpLength,
//                                     ...({ messageID: response?.resData?.id })
//                                 });
//                             } else if (response?.code === StatusCodes.SR410) {
//                                 setShowAlreadyLoginAlert(true);
//                             } else if (response?.code === StatusCodes.SR414) {
//                                 const msg = utils.getInterpolationString(
//                                     response?.message,
//                                     ['%S'],
//                                     [
//                                         moment(
//                                             response?.resData?.loginBlockedTill
//                                         ).format('HH:mm'),
//                                     ]
//                                 );
//                                 setErrorMessage(msg ?? '');
//                             } else {
//                                 setErrorMessage(response?.message);
//                             }
//                         }
//                         else {
//                             ShowToast({
//                                 position: 0,
//                                 duration: 5000,
//                                 message:
//                                     translationsData?.translations?.someThingWentWrong ??
//                                     COMMON_API_FAILED_MESSAGE,
//                             });
//                         }
//                     })
//                     .catch(() => {
//                         ShowToast({
//                             position: 0,
//                             duration: 5000,
//                             message:
//                                 translationsData?.translations?.someThingWentWrong ??
//                                 COMMON_API_FAILED_MESSAGE,
//                         });
//                     });
//             }
//         }

