import React, { FC } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { FiArrowLeft, FiEdit3 } from 'react-icons/fi';

// Components
import StatusTag from 'ui/components/StatusTag';

// Constants
import { ROUTES } from 'lib/routes';
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
type TitlePrimaryProps = {
  title: string;
  goBack?: boolean;
  activeTag?: boolean;
  editAction?: () => void;
};

// Styled component
const Title = styled.div`
  width: 100%;
  padding: 60px 0 24px;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: ${BREAKPOINTS.xs}) {
    padding: 10px 0 24px;
  }

  .navigation {
    position: absolute;
    left: -30px;
    top: 70px;

    @media (max-width: ${BREAKPOINTS.sm}) {
      width: 100%;
      position: relative;
      left: initial;
      top: initial;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-bottom: 20px;
    }
    svg {
      transform: scale(2);
    }
    .tag {
      @media (min-width: ${BREAKPOINTS.sm}) {
        display: none;
      }
    }
  }
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: ${BREAKPOINTS.sm}) {
      flex-direction: column;
    }
    h1 {
      color: var(--primary-color);
      font-family: var(--main-font);
      font-weight: bold;
      font-size: 36px;
      line-height: 39px;
      margin: 0;
      width: 100%;
    }
    .edit-action {
      cursor: pointer;
      color: var(--secondary-color);
      font-family: var(--alt-font);
      font-size: 18px;
      line-height: 20px;
      margin-top: 10px;
    }
    .tag {
      margin: 5px auto;
      @media (max-width: ${BREAKPOINTS.sm}) {
        display: none;
      }
    }
  }
`;

const TitlePrimary: FC<TitlePrimaryProps> = ({ title, goBack, editAction, activeTag }) => {
  return (
    <Title>
      <div className={'navigation'}>
        {goBack && (
          <NavLink to={ROUTES.home}>
            <FiArrowLeft color={'var(--primary-color)'} />
          </NavLink>
        )}
        {activeTag && (
          <div className={'tag'}>
            <StatusTag text={'active'} />
          </div>
        )}
      </div>
      <div className={'title'}>
        <div>
          <h1>{title}</h1>
          {editAction && (
            <div className={'edit-action'} onClick={editAction}>
              Edit raffle <FiEdit3 color={'var(--secondary-color)'} />
            </div>
          )}
        </div>
        <div>{activeTag && <StatusTag text={'active'} className={'tag'} />}</div>
      </div>
    </Title>
  );
};

export default TitlePrimary;
