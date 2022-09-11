import '@/assets/styles/globals.scss';
// import { QueryClient, QueryClientProvider } from 'react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import AuthProvider from '../app/providers/auth-provider/AuthProvider';

function MyApp({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false
			}
		}
	});
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
