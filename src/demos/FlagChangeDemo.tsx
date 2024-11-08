import {
  OpenFeature,
  OpenFeatureProvider,
  useBooleanFlagDetails,
  useStringFlagDetails,
  useObjectFlagDetails,
  Logger
} from "@openfeature/react-sdk";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { UnleashWebProvider } from '@openfeature/unleash-web-provider';
import {
  FLAG_CHANGE_DEMO_EXPLANATION,
  FLAG_CHANGE_DEMO_NAME
} from "../constants";
import logo from "../logo.svg";
import "./Demo.css";

const PROVIDER_NAME = FLAG_CHANGE_DEMO_NAME;
const newMessageName = "new-message";

const logger: Logger = new class {
    error(...args: unknown[]): void {
        console.error(...args);
    }

    warn(...args: unknown[]): void {
        console.warn(...args);
    }

    info(...args: unknown[]): void {
        console.info(...args);
    }

    debug(...args: unknown[]): void {
        console.debug(...args);
    }
}();

/**
 * This component is associated with a provider whose flags change every 2 seconds.
 * It demonstrates the React SDKs ability to dynamically react to flag changes from the provider.
 */
function FlagChangeDemo() {
  const [searchParams] = useSearchParams();

  const provider = new UnleashWebProvider({
      url: 'http://localhost:3030/proxy',
      clientKey: 'clientsecret',
      appName: 'staging',
  }, logger);

  // set our provider, give it a name matching the scope of our OpenFeatureProvider below
  OpenFeature.setProvider(PROVIDER_NAME, provider);

  return (
    // this page is scoped to the "flag-change" provider.
    <OpenFeatureProvider domain={PROVIDER_NAME}>
      <Content />
    </OpenFeatureProvider>
  );
}

function Content() {
  return (
    <div className="Demo">
      <header className="Demo-header">
        <p className="Demo-description small-text bounded-text">{FLAG_CHANGE_DEMO_EXPLANATION}</p>
        <Spinner />
      </header>
    </div>
  );
}

function Spinner() {
  // evaluate flag with detailed API
  const { value: showNewMessage } = useBooleanFlagDetails(newMessageName, false);

  return (
    <>
      <img
        src={logo}
        className={showNewMessage ? "Demo-logo Demo-spin" : "Demo-logo"}
        alt="logo"
      />
      {showNewMessage ? (
        <p>Welcome to this OpenFeature-enabled React app! </p>
      ) : (
        <p>Welcome to this React app. {showNewMessage} </p>
      )}
    </>
  );
}

export default FlagChangeDemo;
