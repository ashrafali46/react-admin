import expect from 'expect';
import { fireEvent } from '@testing-library/react';
import * as React from 'react';
import { renderWithRedux } from 'ra-core';

import FilterForm, { mergeInitialValuesWithDefaultValues } from './FilterForm';
import TextInput from '../../input/TextInput';
import SelectInput from '../../input/SelectInput';

describe('<FilterForm />', () => {
    const defaultProps = {
        resource: 'post',
        filters: [],
        setFilters: () => {},
        hideFilter: () => {},
        displayedFilters: {},
        filterValues: {},
    };

    it('should display correctly passed filters', () => {
        const filters = [
            <TextInput source="title" label="Title" />,
            <TextInput source="customer.name" label="Name" />,
        ];
        const displayedFilters = {
            title: true,
            'customer.name': true,
        };

        const { queryAllByLabelText } = renderWithRedux(
            <FilterForm
                {...defaultProps}
                filters={filters}
                displayedFilters={displayedFilters}
            />
        );
        expect(queryAllByLabelText('Title')).toHaveLength(1);
        expect(queryAllByLabelText('Name')).toHaveLength(1);
    });

    describe('allowEmpty', () => {
        it('should keep allowEmpty true if undefined', () => {
            const filters = [
                <SelectInput
                    label="SelectWithUndefinedAllowEmpty"
                    choices={[
                        { title: 'yes', id: 1 },
                        { title: 'no', id: 0 },
                    ]}
                    source="test"
                    optionText="title"
                />,
            ];
            const displayedFilters = {
                test: true,
            };

            const { queryAllByRole, queryByLabelText } = renderWithRedux(
                <FilterForm
                    {...defaultProps}
                    filters={filters}
                    displayedFilters={displayedFilters}
                />
            );

            const select = queryByLabelText('SelectWithUndefinedAllowEmpty');
            fireEvent.mouseDown(select);
            const options = queryAllByRole('option');
            expect(options.length).toEqual(3);
        });

        it('should keep allowEmpty false', () => {
            const filters = [
                <SelectInput
                    label="SelectWithFalseAllowEmpty"
                    allowEmpty={false}
                    choices={[
                        { title: 'yes', id: 1 },
                        { title: 'no', id: 0 },
                    ]}
                    source="test"
                    optionText="title"
                />,
            ];
            const displayedFilters = {
                test: true,
            };

            const { queryAllByRole, queryByLabelText } = renderWithRedux(
                <FilterForm
                    {...defaultProps}
                    filters={filters}
                    displayedFilters={displayedFilters}
                />
            );
            const select = queryByLabelText('SelectWithFalseAllowEmpty');
            fireEvent.mouseDown(select);
            const options = queryAllByRole('option');
            expect(options.length).toEqual(2);
        });

        it('should keep allowEmpty true', () => {
            const filters = [
                <SelectInput
                    label="SelectWithTrueAllowEmpty"
                    allowEmpty={true}
                    choices={[
                        { title: 'yes', id: 1 },
                        { title: 'no', id: 0 },
                    ]}
                    source="test"
                    optionText="title"
                />,
            ];
            const displayedFilters = {
                test: true,
            };

            const { queryAllByRole, queryByLabelText } = renderWithRedux(
                <FilterForm
                    {...defaultProps}
                    filters={filters}
                    displayedFilters={displayedFilters}
                />
            );
            const select = queryByLabelText('SelectWithTrueAllowEmpty');
            fireEvent.mouseDown(select);
            const options = queryAllByRole('option');
            expect(options.length).toEqual(3);
        });
    });

    describe('mergeInitialValuesWithDefaultValues', () => {
        it('should correctly merge initial values with the default values of the alwaysOn filters', () => {
            const initialValues = {
                title: 'initial title',
            };
            const filters = [
                {
                    props: {
                        source: 'title',
                        alwaysOn: true,
                        defaultValue: 'default title',
                    },
                },
                {
                    props: {
                        source: 'url',
                        alwaysOn: true,
                        defaultValue: 'default url',
                    },
                },
                {
                    props: {
                        source: 'author.name',
                        alwaysOn: true,
                        defaultValue: 'default author',
                    },
                },
                { props: { source: 'notMe', defaultValue: 'default url' } },
                { props: { source: 'notMeEither' } },
            ];

            expect(
                mergeInitialValuesWithDefaultValues({ initialValues, filters })
            ).toEqual({
                title: 'initial title',
                url: 'default url',
                author: { name: 'default author' },
            });
        });
    });
});
