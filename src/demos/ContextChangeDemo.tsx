import {
  EvaluationContext,
  OpenFeature,
  OpenFeatureProvider,
  useBooleanFlagDetails,
  useFlag,
  Logger
} from "@openfeature/react-sdk";
import { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { UnleashWebProvider } from '@openfeature/unleash-web-provider';
import {
  CONTEXT_CHANGE_DEMO_EXPLANATION,
  CONTEXT_CHANGE_DEMO_NAME,
} from "../constants";
import hourglass from "../hourglass.svg";
import logo from "../logo.svg";
import "./Demo.css";

const PROVIDER_NAME = CONTEXT_CHANGE_DEMO_NAME;

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
 * A component associated with a provider that becomes ready after a few seconds.
 * It demonstrates the "Suspense" support of the React SDK.
 */
function ContextChangeDemo() {
  const [searchParams] = useSearchParams();

  const goFastName = "go-fast";

  const provider = new UnleashWebProvider({
      url: 'http://localhost:3030/proxy',
      clientKey: 'clientsecret',
      appName: 'context-change',
  }, logger);

  // Set our provider, give it a name matching the scope of our OpenFeatureProvider below
  OpenFeature.setProvider(PROVIDER_NAME, provider);

  return (
    // This page is scoped to the "suspense" provider.
    <OpenFeatureProvider domain={PROVIDER_NAME} suspend={true}>
      <Content />
    </OpenFeatureProvider>
  );
}

function Content() {
  return (
    <div className="Demo">
      <header className="Demo-header">
        <p className="Demo-description small-text bounded-text">{CONTEXT_CHANGE_DEMO_EXPLANATION}</p>
        <ContextChangeButton />
        <Suspense fallback={<Fallback />}>
          <Spinner />
        </Suspense>
      </header>
    </div>
  );
}

function ContextChangeButton() {
  return (
    <span>
      <span>Click </span>
      <button
        onClick={() => {
          OpenFeature.setContext(PROVIDER_NAME, {
            userId: OpenFeature.getContext(PROVIDER_NAME).userId === 'user1' ? 'user2' : 'user1',
          });
        }}
      >
        here
      </button>!OpenFeature.getContext(PROVIDER_NAME).user
      <span> to modify the evaluation context</span>
    </span>
  );
}

function Spinner() {
  // evaluate flag with react-query style API
  const { value: goFast } = useFlag("go-fast", false);

  return (
    <>
      <img
        src={logo}
        className="Demo-logo Demo-spin"
        style={{
          padding: 20,
          animation: goFast ? "spin infinite 1s linear" : "",
        }}
        alt="logo"
      />
      {goFast ? (
        <p>Welcome to this silly React app!</p>
      ) : (
        <p>Welcome to this React app.</p>
      )}
    </>
  );
}


function Fallback() {
  return (
    <>
      <img src={hourglass} className="Demo-logo Fallback-img" alt="hourglass" />
      <p>Waiting for provider context-update...</p>
    </>
  );
}

export default ContextChangeDemo;
