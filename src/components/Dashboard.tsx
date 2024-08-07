// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert, Form, InputGroup, Container, Row, Col, Pagination } from 'react-bootstrap';
import { Star, StarFill } from 'react-bootstrap-icons';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

type Transaction = {
  txid: string;
  status: {
    block_time: number;
    confirmed: boolean;
  };
  vout: {
    value: number;
  }[];
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [lastFetchedTxid, setLastFetchedTxid] = useState<string | null>(null);

  const transactionsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const fetchTransactions = async (btcAddress: string, afterTxid?: string) => {
    setLoading(true);
    setError('');
    try {
      const url = afterTxid
        ? `https://mempool.space/api/address/${btcAddress}/txs?after_txid=${afterTxid}`
        : `https://mempool.space/api/address/${btcAddress}/txs`;
      const response = await axios.get(url);
      const fetchedTransactions: Transaction[] = response.data;

      setTransactions((prevTransactions) => [...prevTransactions, ...fetchedTransactions]);
      setTotalPages(Math.ceil((transactions.length + fetchedTransactions.length) / transactionsPerPage));
      setHasMoreTransactions(fetchedTransactions.length === 50); // Check if there are potentially more transactions to fetch
      if (fetchedTransactions.length > 0) {
        setLastFetchedTxid(fetchedTransactions[fetchedTransactions.length - 1].txid);
      }
    } catch (error) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAddress && inputAddress !== address) {
      setAddress(inputAddress);
      setCurrentPage(1); // Reset to the first page on new search
      setTransactions([]); // Clear previous transactions
      setHasMoreTransactions(true); // Reset to assume more transactions available until fetched
      setLastFetchedTxid(null); // Reset last fetched transaction ID
    }
  };  

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (address && transactions.length === 0) {
      fetchTransactions(address);
    }
  }, [address]);

  useEffect(() => {
    const fetchMoreTransactionsIfNeeded = async () => {
      if (address && (currentPage - 1) * transactionsPerPage >= transactions.length && hasMoreTransactions) {
        await fetchTransactions(address, lastFetchedTxid || undefined);
      }
    };
    fetchMoreTransactionsIfNeeded();
  }, [currentPage]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const toggleFavorite = (txid: string) => {
    const updatedFavorites = favorites.includes(txid)
      ? favorites.filter((fav) => fav !== txid)
      : [...favorites, txid];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const displayTransactions = transactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} active={currentPage === 1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item key={page} active={currentPage === page} onClick={() => setCurrentPage(page)}>
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      items.push(
        <Pagination.Item key={totalPages} active={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Container className="dashboard-container">
      <Row>
        <Col>
          <h2 className="dashboard-header">Transactions</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSearch} className="search-bar">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter a Bitcoin address"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
              />
              <Button variant="primary" type="submit">Search</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {loading && <div className="center-spinner"><Spinner animation="border" /></div>}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && transactions.length > 0 && (
            <>
              <div className="table-container">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Favorite</th>
                      <th>Date</th>
                      <th>Amount (BTC)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTransactions.map((tx) => (
                      <tr key={tx.txid}>
                        <td onClick={() => toggleFavorite(tx.txid)} className="text-center favorite-icon">
                          {favorites.includes(tx.txid) ? <StarFill color="gold" /> : <Star />}
                        </td>
                        <td>{formatDate(tx.status.block_time)}</td>
                        <td>{(tx.vout.reduce((acc, vout) => acc + vout.value, 0) / 100000000).toFixed(8)}</td>
                        <td>{tx.status.confirmed ? 'Confirmed' : 'Unconfirmed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Pagination className="justify-content-center">
                <Pagination.Prev
                  onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                  disabled={currentPage === 1}
                />
                {renderPaginationItems()}
                <Pagination.Next
                  onClick={async () => {
                    const nextPage = currentPage + 1;
                    if ((nextPage - 1) * transactionsPerPage >= transactions.length && hasMoreTransactions) {
                      const lastTransaction = transactions[transactions.length - 1];
                      if (lastTransaction) {
                        await fetchTransactions(address, lastTransaction.txid);
                      }
                    }
                    setCurrentPage(nextPage);
                  }}
                  disabled={!hasMoreTransactions && currentPage === totalPages}
                />
              </Pagination>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
