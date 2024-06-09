import Content from './components/Content.jsx';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();
const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Content />
      </QueryClientProvider>
    </>
  );
};

export default App;
