import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Row, Col } from 'antd';
import { FiSearch } from 'react-icons/fi';
import { useDebounce } from 'use-debounce';

// Lib
import { useEvents } from 'lib/hooks/useEvents';
import { useRaffles } from 'lib/hooks/useRaffles';

// Helpers
import { mergeRaffleEvent, regenerateRaffleEvents } from 'lib/helpers/api';

// Components
import Input from 'ui/components/Input';
import Loading from 'ui/components/Loading';
import { Form } from 'ui/styled/antd/Form';
import { Button } from 'ui/styled/antd/Button';
import { Container } from 'ui/styled/Container';
import { SearchForm } from 'ui/styled/SearchForm';
import { LoadMore } from 'ui/styled/LoadMore';
import TitleSecondary from 'ui/components/TitleSecondary';
import RaffleCard from 'ui/components/RaffleCard';

/// Constants
import { API_PAGE_SIZE } from 'lib/constants/api';

// Schema
import RaffleSearchSchema from './schema';

// Types
import { CompleteRaffle } from 'lib/types';
export type RaffleSearchFormValue = {
  query: string;
};

const initialValues: RaffleSearchFormValue = {
  query: '',
};

const RaffleGrid: FC = () => {
  // React hooks
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [query, setQuery] = useState<string>('');
  const [raffles, setRaffles] = useState<CompleteRaffle[]>([]);

  const [debouncedSearchTerm] = useDebounce(query, 600);

  // Query hooks
  const { data: events } = useEvents();
  const { data: apiRaffles, isLoading } = useRaffles({ page, query: debouncedSearchTerm });

  // Methods
  const changePage = () => setPage(page + 1);

  // Lib hooks
  const { values, errors, touched, handleChange } = useFormik({
    initialValues,
    onSubmit: () => {},
    validationSchema: RaffleSearchSchema,
  });

  // Effects
  useEffect(() => {
    setQuery(values.query);
  }, [values]); //eslint-disable-line

  useEffect(() => {
    if (debouncedSearchTerm) {
      setRaffles([]);
      setPage(1);
    }
  }, [debouncedSearchTerm]); //eslint-disable-line

  useEffect(() => {
    if (!apiRaffles) return;
    let _events = events && events.length > 0 ? events : [];

    setRaffles((prevRaffles) => [...prevRaffles, ...mergeRaffleEvent(apiRaffles.results, _events)]);
    setTotalPages(Math.ceil(apiRaffles.count / API_PAGE_SIZE));
  }, [apiRaffles, events]); //eslint-disable-line

  useEffect(() => {
    if (!raffles || !events) return;
    setRaffles(regenerateRaffleEvents(raffles, events));
  }, [events]); //eslint-disable-line

  return (
    <Container sidePadding>
      <TitleSecondary title={'POAP raffles'} />
      <SearchForm>
        <Form onSubmit={(ev) => ev.preventDefault()}>
          <Input
            errors={errors}
            handleChange={handleChange}
            label=""
            name="query"
            placeholder="Search by name"
            touched={touched}
            values={values}
            prefix={<FiSearch color={'var(--system-placeholder)'} />}
          />
        </Form>
      </SearchForm>
      <Row gutter={16}>
        {raffles.map((raffle: CompleteRaffle) => {
          return (
            <Col xs={24} sm={12} md={12} lg={8} key={raffle.id}>
              <RaffleCard raffle={raffle} />
            </Col>
          );
        })}
      </Row>
      {isLoading && <Loading />}
      {!isLoading && page < totalPages && (
        <LoadMore>
          <Button onClick={changePage} type={'primary'}>
            Load More
          </Button>
        </LoadMore>
      )}
    </Container>
  );
};

export default RaffleGrid;
