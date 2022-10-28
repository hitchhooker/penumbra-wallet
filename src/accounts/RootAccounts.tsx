import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAccountsSelector } from '.';
import { routesPath } from '../utils';
import { selectSelectedAccount, selectState } from '../ui/redux';
import { RootWrapperAccount } from '../ui/containers';

export const RootAccounts = () => {
  const navigate = useNavigate();

  const state = useAccountsSelector(selectState);
  const appState = useAccountsSelector((s) => s);
  const selectedAccount = useAccountsSelector(selectSelectedAccount);

  useEffect(() => {
    if (selectedAccount.name) return navigate(routesPath.HOME);
    //TODO change to routesPath.WELCOME
    if (!state.isInitialized) return navigate(routesPath.WELCOME);
    if (state.isInitialized && !state.isLocked)
      return navigate(routesPath.SEED_PHRASE_RULES);
    if (state.isInitialized && state.isLocked)
      return navigate(routesPath.LOGIN);
  }, [state.isInitialized, state.isLocked, selectedAccount]);

  return (
    <RootWrapperAccount>
      <Outlet />
    </RootWrapperAccount>
  );
};
