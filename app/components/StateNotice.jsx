// Presentation Component: Standardized accessible alert container for runtime/network failures.
export function ErrorNotice({ title, message, retryLabel = 'Retry', onRetry }) {
  return (
    <div role="alert" className="alert-card">
      <h2 className="alert-heading">{title}</h2>
      <p
        style={{
          margin: '0 0 var(--space-4)',
          fontSize: 'var(--text-sm)',
          color: 'var(--ink-soft)',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary">
          {retryLabel}
        </button>
      )}
    </div>
  );
}

// Presentation Component: Standardized accessible empty-state container.
export function EmptyNotice({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-card">
      <h2 className="empty-heading">{title}</h2>
      <p
        style={{
          margin: actionLabel ? '0 0 var(--space-4)' : 0,
          fontSize: 'var(--text-sm)',
          color: 'var(--ink-soft)',
          maxWidth: '50ch',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {message}
      </p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-secondary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

