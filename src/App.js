import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loader from './components/UI/Loader/Loader';

import Auth from './components/Auth/Auth';

//contexts
import useLoading from './context/loading';
import useAuthContext from './context/auth';

//components
const Sidebar =  React.lazy(() => import('./components/Sidebar/Sidebar'));

const PublishInvoice = React.lazy(() => import('./components/Invoices/PublishInvoice/PublishInvoice'));
const ShowInvoice = React.lazy(() => import('./components/Invoices/ShowInvoice/ShowInvoice'));

const Info = React.lazy(() => import('./components/Info/Info'));

const EditType = React.lazy(() => import('./components/Type/EditType/EditType'));
const CreateType = React.lazy(() => import('./components/Type/CreateType/CreateType'));
const Type = React.lazy(() => import('./components/Type/Type'));

function App() {
  const loading = useLoading().loading;

  const isAuth = useAuthContext()?.userId ? true : false;

  const Routes = (
    <Switch>
      <Route path="/info" component={Info} />

      <Route path="/customers/edit:id" component={EditType} />
      <Route path="/customers/create-customer" component={CreateType} />
      <Route path="/customers" component={Type} />

      <Route path="/products/edit:id" component={EditType} />
      <Route path="/products/create-product" component={CreateType} />
      <Route path="/products" component={Type} />

      <Route path="/invoices/show:id" component={ShowInvoice} />
      <Route path="/invoices/edit:id" render={(props) => <PublishInvoice edit {...props} />} />
      <Route path="/invoices/create-invoice" component={PublishInvoice} />
      <Route path="/invoices" component={Type} />

      <Route path="/" exact>
        <Redirect to="/invoices" />
      </Route>
    </Switch>
  );

  return (
    <>
      {loading && <Loader />}
      {isAuth ?
        <>
          <Sidebar />
          <div className="app-content">
            {Routes}
          </div>
        </>
      :
        <Auth />
      }
    </>
  );
}

export default App;
