import type { ReactNode } from "react";

type ListContainerProps = {
  title: string;
  description?: string;
  meta?: ReactNode;
  children: ReactNode;
};

export function ListContainer({
  title,
  description,
  meta,
  children,
}: ListContainerProps) {
  return (
    <section className="list-container" aria-labelledby={`${title}-title`}>
      <div className="list-container__header">
        <div>
          <h2 className="list-container__title" id={`${title}-title`}>
            {title}
          </h2>
          {description ? (
            <p className="list-container__description">{description}</p>
          ) : null}
        </div>
        {meta ? <div className="list-container__meta">{meta}</div> : null}
      </div>
      <div className="list-container__body">{children}</div>
    </section>
  );
}
