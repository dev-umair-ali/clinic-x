"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Trash2,
  Check,
  Shield,
  Lock,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
  holderName: string;
  isDefault: boolean;
  zipCode: string;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock saved cards
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: "1",
      last4: "4532",
      brand: "Visa",
      expiry: "12/25",
      holderName: "EMMA WILSON",
      isDefault: true,
      zipCode: "10001",
    },
    {
      id: "2",
      last4: "8901",
      brand: "Mastercard",
      expiry: "06/26",
      holderName: "EMMA WILSON",
      isDefault: false,
      zipCode: "10001",
    },
  ]);

  // Add card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSetDefault = (cardId: string) => {
    setSavedCards(cards =>
      cards.map(card => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  const handleDeleteCard = () => {
    if (selectedCard) {
      setSavedCards(cards => cards.filter(card => card.id !== selectedCard));
      setShowDeleteDialog(false);
      setSelectedCard(null);
    }
  };

  const handleAddCard = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const cardBrand = cardNumber.startsWith("4") ? "Visa" : "Mastercard";
    const newCard: SavedCard = {
      id: Date.now().toString(),
      last4: cardNumber.replace(/\s/g, "").slice(-4),
      brand: cardBrand,
      expiry: expiryDate,
      holderName: cardName,
      isDefault: setAsDefault,
      zipCode: zipCode,
    };

    if (setAsDefault) {
      setSavedCards(cards =>
        cards.map(card => ({ ...card, isDefault: false }))
      );
    }

    setSavedCards(cards => [...cards, newCard]);
    
    // Reset form
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
    setZipCode("");
    setSetAsDefault(false);
    setIsProcessing(false);
    setShowAddCard(false);
  };

  const isAddCardFormValid = () => {
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      cardName.length > 0 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      zipCode.length >= 5
    );
  };

  const getCardIcon = (brand: string) => {
    const gradients: Record<string, string> = {
      Visa: "from-blue-500 to-blue-700",
      Mastercard: "from-orange-500 to-red-600",
      Amex: "from-green-500 to-green-700",
      Discover: "from-orange-400 to-orange-600",
    };

    return (
      <div className={`w-14 h-10 bg-gradient-to-br ${gradients[brand] || "from-gray-500 to-gray-700"} rounded-md flex items-center justify-center text-white font-semibold text-xs shadow-md`}>
        {brand}
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Payment Methods
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your saved payment methods
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowAddCard(true)}
                className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90"
              >
                <Plus className="w-4 h-4" />
                Add Payment Method
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Saved Cards */}
            <div className="lg:col-span-2 space-y-4">
              {savedCards.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CreditCard className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Payment Methods
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Add a payment method to make payments faster
                    </p>
                    <Button
                      onClick={() => setShowAddCard(true)}
                      className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                    >
                      <Plus className="w-4 h-4" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                savedCards.map((card) => (
                  <Card key={card.id} className={card.isDefault ? "border-2 border-[#1DA68F]" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {getCardIcon(card.brand)}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                {card.brand} •••• {card.last4}
                              </h3>
                              {card.isDefault && (
                                <Badge className="bg-[#1DA68F] hover:bg-[#1DA68F] text-white">
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {card.holderName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Expires {card.expiry}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!card.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(card.id)}
                              className="gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCard(card.id);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Info */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-blue-900 dark:text-blue-100">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 mt-0.5" />
                    <p>All payment information is encrypted using 256-bit SSL encryption</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5" />
                    <p>We never store your complete card number or CVV</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5" />
                    <p>PCI DSS Level 1 compliant payment processing</p>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Questions about managing your payment methods?
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card for future payments
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="new-card-number">Card Number</Label>
              <Input
                id="new-card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-card-name">Cardholder Name</Label>
              <Input
                id="new-card-name"
                placeholder="JOHN DOE"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-expiry">Expiry</Label>
                <Input
                  id="new-expiry"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-cvv">CVV</Label>
                <Input
                  id="new-cvv"
                  placeholder="123"
                  type="password"
                  value={cvv}
                  onChange={handleCvvChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-zip">ZIP</Label>
                <Input
                  id="new-zip"
                  placeholder="12345"
                  value={zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/gi, "");
                    if (value.length <= 5) setZipCode(value);
                  }}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="set-default"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="set-default" className="text-sm cursor-pointer">
                Set as default payment method
              </Label>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100 flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5" />
              <p>Your card information is encrypted and secured</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddCard(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCard}
              disabled={!isAddCardFormValid() || isProcessing}
              className="bg-[#1DA68F] hover:bg-[#1DA68F]/90"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add Card"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-sm text-amber-900 dark:text-amber-100 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>
              If this is your only payment method, you'll need to add a new one before making future payments.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCard}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
