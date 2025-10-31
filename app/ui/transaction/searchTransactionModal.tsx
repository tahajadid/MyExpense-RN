import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ModalWrapper from '@/components/ModalWrapper';
import TransactionItem from '@/components/TransactionItem';
import Typo from '@/components/Typo';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import useThemeColors from '@/hooks/useThemeColors';
import { TransactionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { FlashList } from "@shopify/flash-list";
import { useRouter } from 'expo-router';
import { orderBy, Timestamp, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchTransactionModal = () => {
  const colors = useThemeColors();
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');

  // Fetch all transactions for the user
  const transactionsConstraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc")
  ];

  const {
    data: allTransactions,
    loading: transactionsLoading
  } = useFetchData<TransactionType>("transactions", transactionsConstraints);

  // Filter transactions based on search query and type
  const filteredTransactions = allTransactions?.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    return matchesSearch && matchesType;
  }) || [];

  const handleTransactionClick = (item: TransactionType) => {
    router.push({
      pathname: "./newTransaction",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate().toISOString(),
        description: item?.description,
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId
      }
    });
  };

  return (
    <ModalWrapper>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
              
              <Header
                title="Transactions"
                leftIcon={<BackButton />}
                style={{ marginBottom: spacingY._10 }}
              />

              {/* Search Input */}
              <View style={[styles.searchContainer, { backgroundColor: colors.screenBackground }]}>
                <Pressable style={[styles.searchInputContainer, { backgroundColor: colors.searchIconBackground }]}>
                  <Icons.MagnifyingGlass
                    size={verticalScale(20)}
                    color={colors.neutral300}
                    weight="regular"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search by name or category..."
                    placeholderTextColor={colors.neutral400}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable
                      onPress={() => setSearchQuery('')}
                      style={styles.clearButton}
                    >
                      <Icons.X
                        size={verticalScale(14)}
                        color={colors.neutral300}
                        weight="bold"
                      />
                    </Pressable>
                  )}
                </Pressable>
              </View>

              {/* Type Filter Buttons */}
              <View style={styles.filterContainer}>
                <Pressable
                  style={[
                    styles.filterButton,
                    { backgroundColor: selectedType === 'all' ? colors.primary : colors.searchIconBackground }
                  ]}
                  onPress={() => setSelectedType('all')}
                >
                  <Typo 
                    size={12} 
                    color={selectedType === 'all' ? colors.white : colors.text}
                    fontWeight="500"
                  >
                    All
                  </Typo>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.filterButton,
                    { backgroundColor: selectedType === 'expense' ? '#EF4444' : colors.searchIconBackground }
                  ]}
                  onPress={() => setSelectedType('expense')}
                >
                  <Typo 
                    size={12} 
                    color={selectedType === 'expense' ? colors.white : colors.text}
                    fontWeight="500"
                  >
                    Expense
                  </Typo>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.filterButton,
                    { backgroundColor: selectedType === 'income' ? '#10B981' : colors.searchIconBackground }
                  ]}
                  onPress={() => setSelectedType('income')}
                >
                  <Typo 
                    size={12} 
                    color={selectedType === 'income' ? colors.white : colors.text}
                    fontWeight="500"
                  >
                    Income
                  </Typo>
                </Pressable>
              </View>

              {/* Results Count */}
              {searchQuery.length > 0 && (
                <View style={styles.resultsContainer}>
                  <Typo size={14} color={colors.neutral400}>
                    {filteredTransactions.length} result{filteredTransactions.length !== 1 ? 's' : ''} found
                  </Typo>
                </View>
              )}

              {/* Transaction List */}
              <View style={styles.listContainer}>
                {transactionsLoading ? (
                  <View style={styles.loadingContainer}>
                    <Loading colorLoader={colors.primary} />
                  </View>
                ) : (
                  <FlashList
                    data={filteredTransactions}
                    renderItem={({ item, index }) => (
                      <TransactionItem 
                        item={item} 
                        index={index} 
                        handleClick={handleTransactionClick}
                      />
                    )}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <Icons.MagnifyingGlass
                          size={verticalScale(48)}
                          color={colors.neutral300}
                          weight="light"
                        />
                        <Typo size={16} color={colors.neutral400} style={styles.emptyText}>
                          {searchQuery.length > 0 
                            ? "No transactions found matching your search"
                            : "Search for transactions by name or category"
                          }
                        </Typo>
                      </View>
                    }
                  />
                )}
              </View>
              
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ModalWrapper>
  );
};

export default SearchTransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  searchContainer: {
    marginTop: spacingY._10,
    marginBottom: spacingY._15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius._12,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
  },
  searchIcon: {
    marginRight: spacingX._10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacingX._3,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacingX._10,
    marginBottom: spacingY._15,
  },
  filterButton: {
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    borderRadius: radius._10,
    minWidth: 70,
    alignItems: 'center',
  },
  resultsContainer: {
    marginBottom: spacingY._10,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacingY._20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingY._40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacingY._15,
    paddingHorizontal: spacingX._20,
  },
});